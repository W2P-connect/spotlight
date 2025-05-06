import { NextRequest, NextResponse } from "next/server";
import { logWarning } from "./errorHandler";
import { Json } from "@/types";
import { isJsonSerializable, safeStringify } from "./utils";

type BaseApiResponseParams = {
    message: string;
    data?: any;
    error?: string | null;
    success: boolean;
    status?: number;
};
type ApiResponseParamsWithLog = BaseApiResponseParams & {
    req: NextRequest;
    log: {
        message: string;
        userId?: string; //default : req.headers.get("x-user-id")
        endpoint?: string; //default : req.nextUrl.pathname
        metadata?: Json;
        internalError?: unknown;
    };
};

type ApiResponseParamsWithoutLog = BaseApiResponseParams & {
    req?: undefined;
    log?: undefined;
};

type ApiResponseParams = ApiResponseParamsWithLog | ApiResponseParamsWithoutLog;

export async function apiResponse({
    req,
    message,
    data = null,
    error = null,
    success,
    status,
    log,
}: ApiResponseParams) {
    if (!success && log) {
        const safeMetadata = isJsonSerializable(log.metadata) ? log.metadata : { note: "Unserializable metadata" };

        let body = null;
        try {
            body = await req.clone().json();
        } catch (_) {
            body = null;
        }

        await logWarning({
            message,
            userId: log.userId ?? (req.headers.get("x-user-id") as string | undefined),
            endpoint: log.endpoint ?? req.nextUrl.pathname,
            metadata: {
                ...safeMetadata,
                error: safeStringify(log.internalError),
                params: Object.fromEntries(req.nextUrl.searchParams),
                body,
            },
        });
    }

    return NextResponse.json(
        {
            message,
            data,
            error,
            success,
        },
        { status: status ?? (success ? 200 : 400) }
    );
}
