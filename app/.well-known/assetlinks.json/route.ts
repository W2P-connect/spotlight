export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

/**
 * Android App Links configuration file
 * This file must be served at: https://your-domain.com/.well-known/assetlinks.json
 * Content-Type: application/json
 */
export const GET = async () => {
  // Get SHA-256 fingerprints from environment variable
  // Format: "fingerprint1,fingerprint2" or single fingerprint
  // Set ANDROID_SHA256_FINGERPRINTS in your .env file
  const fingerprintsEnv = process.env.ANDROID_SHA256_FINGERPRINTS || 'YOUR_SHA256_FINGERPRINT_HERE'
  const sha256Fingerprints = fingerprintsEnv.split(',').map((f) => f.trim()).filter(Boolean)

  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.strivup.spotlightapp',
        sha256_cert_fingerprints: sha256Fingerprints,
      },
    },
  ]

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

