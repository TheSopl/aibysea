import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const ALLOWED_EMAILS = [
  'tech@aibysea.com',
  'osama@seatourism.sa',
  'nouraldeen@seatourism.sa',
  'mariam@seatourism.sa',
  'ahmet.ata@seatourism.sa',
  'mahmoud@seatourism.sa',
]

export async function POST(request: Request) {
  const { email, password, fullName } = await request.json()

  const normalizedEmail = email?.toLowerCase().trim()

  if (!normalizedEmail || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
    return NextResponse.json(
      { error: 'This email is not authorized to create an account.' },
      { status: 403 }
    )
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

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName || '',
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: data.user }, { status: 200 })
}
