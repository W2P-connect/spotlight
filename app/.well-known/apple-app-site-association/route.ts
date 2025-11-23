export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

/**
 * Extract domain from server URL
 */
const getDomainFromUrl = (url: string | undefined): string | null => {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

/**
 * Apple App Site Association file for Universal Links
 * This file must be served at: https://your-domain.com/.well-known/apple-app-site-association
 * Content-Type: application/json (not application/pkcs7-mime)
 */
export const GET = async () => {
  // Get domain from environment variable (same as mobile app uses)
  // You can also set APPLE_TEAM_ID in environment variables
  const serverUrl = process.env.EXPO_PUBLIC_SERVEUR_URL || process.env.NEXT_PUBLIC_SERVEUR_URL
  const domain = getDomainFromUrl(serverUrl)
  const teamId = process.env.APPLE_TEAM_ID || 'TEAM_ID' // Set this in your .env file

  const association = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${teamId}.com.strivup.spotlightapp`,
          paths: [
            '/api/v1/public/share/history/*',
            '/api/v1/public/share/*',
          ],
        },
      ],
    },
  }

  return NextResponse.json(association, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

