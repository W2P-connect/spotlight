export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const since = searchParams.get("since");

  const whereClause: Prisma.ConstantesWhereInput = {};

  if (since) {
    whereClause.updatedAt = { gt: new Date(since) };
  }

  const constantes = await prisma?.constantes.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  return apiResponse({
    message: "Successfully geted exercises",
    data: constantes,
    success: true,
  });
});
