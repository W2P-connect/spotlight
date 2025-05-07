import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "./apiResponse";
import { isJsonSerializable } from "./utils";
import { Json } from "@/types";

type Handler = (req: NextRequest, ctx?: any) => Promise<Response>;

export function withErrorHandler(handler: Handler): Handler {
    return async (req: NextRequest, ctx?: any): Promise<Response> => {
        let body: any = null;

        const methodAllowsBody = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

        if (methodAllowsBody) {
            try {
                body = await req.json();
                (req as any).json = async () => body; //OverWrite la fonction qui ne peut ce lancer de base qu'une fois
            } catch (_) {
                console.log("Failed to parse request body");
            }
        }

        try {
            return await handler(req, ctx);
        } catch (error: any) {
            const user_id = req.headers.get("x-user-id");

            try {
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
                            error,
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
    level = "warning",
}: {
    message: string;
    endpoint: string;
    userId?: string | null;
    metadata?: Json;
    level?: "warning" | "error";
}) {
    try {
        const safeMetadata = isJsonSerializable(metadata) ? metadata : { note: "Unserializable metadata" };

        await prisma.errorLog.create({
            data: {
                level,
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
