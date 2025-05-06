import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "./apiResponse";
import { isJsonSerializable } from "./utils";
import { Json } from "@/types";

type Handler = (req: NextRequest, ctx?: any) => Promise<Response>;

export function withErrorHandler(handler: Handler): Handler {
    return async (req: NextRequest, ctx?: any): Promise<Response> => {
        try {
            return await handler(req, ctx);
        } catch (error: any) {
            const user_id = req.headers.get("x-user-id");

            // Log en base
            try {
                let body = null;
                try {
                    body = await req.clone().json();
                } catch (_) {
                    body = null;
                }

                const enrichedErrorInfo = {
                    name: error?.name,
                    message: error?.message,
                    code: error?.code,
                    meta: error?.meta,
                    target: error?.target,
                    clientVersion: error?.clientVersion,
                    stack: error?.stack,
                };



                await prisma.errorLog.create({
                    data: {
                        level: "error",
                        message: error.message || "Unknown error",
                        stackTrace: error.stack || "",
                        endpoint: req.nextUrl.pathname,
                        userId: user_id ?? null,
                        metadata: {
                            method: req.method,
                            params: Object.fromEntries(req.nextUrl.searchParams),
                            body,
                            headers: Object.fromEntries(req.headers.entries()),
                            error: enrichedErrorInfo,
                        },
                        environment: process.env.NODE_ENV ?? "production",
                    },
                });
            } catch (logError) {
                console.error("Failed to log error:", logError);
            }

            return apiResponse({
                success: false,
                message: "Internal Server Error",
                status: 500,
            });
        }
    };
}

export async function logWarning({
    message,
    endpoint,
    userId,
    metadata,
}: {
    message: string;
    endpoint: string;
    userId?: string | null;
    metadata?: Json;
}) {
    try {
        const safeMetadata = isJsonSerializable(metadata) ? metadata : { note: "Unserializable metadata" };

        await prisma.errorLog.create({
            data: {
                level: "warning",
                message,
                stackTrace: "", // Pas de stack pour les warnings métier
                endpoint,
                userId: userId ?? null,
                metadata: safeMetadata,
                environment: process.env.NODE_ENV ?? "production",
            },
        });
    } catch (error) {
        console.error("Failed to log warning:", error);
    }
}
