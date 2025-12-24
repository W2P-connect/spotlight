export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

/**
 * Redirect route for sharing workout template
 * This route redirects HTTPS links to the deep link scheme
 * Format: /api/v1/public/share/template/{id} -> spotlight://public/template/{id}
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { message: 'Template ID is required', success: false },
      { status: 400 }
    )
  }

  // Redirect to the deep link
  const deepLink = `spotlight://public/template/${id}`
  
  // For web browsers, redirect to the deep link
  // For apps with Universal Links/App Links configured, this will open the app directly
  return NextResponse.redirect(deepLink, { status: 302 })
}

