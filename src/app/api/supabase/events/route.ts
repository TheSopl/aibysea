import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const payload = await request.json()
  console.log('[Supabase Events]', payload)
  return NextResponse.json({ received: true })
}
