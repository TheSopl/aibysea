import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Emergency endpoint to clear oversized avatar_url from user metadata
// This fixes HTTP 431 errors caused by base64 images in the JWT cookie
export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Find the user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  const user = users.find(u => u.email === email.toLowerCase().trim())
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Set avatar_url to empty string (Supabase merges metadata, so delete doesn't work)
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { user_metadata: { avatar_url: '' } }
  )

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Avatar cleared. Clear your browser cookies for this site, then log in again.' })
}
