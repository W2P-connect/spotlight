import { NextResponse } from "next/server";

type ApiResponseParams = {
    message: string;
    data?: any;
    error?: string | null;
    success: boolean;
    status?: number;  // Permet de forcer un status custom si besoin
};

export function apiResponse({ message, data = null, error = null, success, status }: ApiResponseParams) {
    return NextResponse.json(
        {
            message,
            data,
            success,
            error
        },
        { status: status || (success ? 200 : 400) }
    );
}