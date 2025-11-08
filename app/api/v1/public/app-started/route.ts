export const dynamic = 'force-dynamic';

import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const POST = withErrorHandler(async (req: NextRequest) => {
    let body: any = null;
    
    try {
        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            body = await req.json();
        }
    } catch (_) {
        // Ignore parsing errors
    }

    const userId = body?.userId || null;
    const metadata = body?.metadata || {};

    try {
        await prisma.log.create({
            data: {
                level: "log",
                message: "App started",
                stackTrace: "",
                endpoint: req.nextUrl.pathname,
                userId: userId || null,
                metadata: {
                    ...metadata,
                    method: req.method,
                    userAgent: req.headers.get("user-agent") || null,
                },
                environment: process.env.NODE_ENV ?? "production",
            },
        });

        return apiResponse({
            message: 'App started log created successfully',
            data: null,
            success: true,
        });
    } catch (error) {
        console.error("Failed to log app started:", error);
        return apiResponse({
            message: 'Failed to log app started',
            data: null,
            success: false,
            status: 500,
        });
    }
});

