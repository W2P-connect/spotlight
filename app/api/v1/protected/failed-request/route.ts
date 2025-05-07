import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withErrorHandler } from '@/utils/errorHandler'
import { apiResponse } from '@/utils/apiResponse'

const failedRequestSchema = z.object({
    endpoint: z.string(),
    method: z.enum(['POST', 'PUT', 'DELETE']),
    data: z.any().nullable(),
    totalTry: z.number().min(0),
    lastTry: z.number().optional(), // timestamp
    deviceId: z.string().optional(),
    appVersion: z.string().optional(),
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get('x-user-id') as string

    const body = await req.json()
    const parsed = failedRequestSchema.safeParse(body)

    if (!parsed.success) {
        return apiResponse({
            message: 'Invalid request body',
            error: parsed.error.message,
            success: false,
        })
    }

    const { endpoint, method, data, totalTry, lastTry, deviceId, appVersion } = parsed.data

    const errorLog = await prisma.failedClientRequest.create({
        data: {
            userId,
            endpoint,
            method,
            data,
            totalTry,
            lastTry: lastTry ? new Date(lastTry) : undefined,
            deviceId,
            appVersion,
        },
    })

    return apiResponse({
        message: 'Failed request logged successfully',
        data: errorLog,
        success: true,
    })
})
