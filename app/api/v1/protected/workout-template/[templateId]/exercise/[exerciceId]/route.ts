export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { updateWorkoutTemplateExerciseSchema } from "@/lib/zod/template";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";
import { removeUndefined, safeStringify } from "@/utils/utils";
import { NextRequest } from "next/server";

export const PUT = withErrorHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string; exerciceId: string }> }
  ) => {
    const userId = req.headers.get("x-user-id") as string; //From middleware;
    const { templateId, exerciceId } = await params;

    if (!exerciceId || !templateId)
      return apiResponse({
        message: "Missing required parameters: templateId and/or exerciceId",
        success: false,
      });

    const body = await req.json();
    const parsedBody = updateWorkoutTemplateExerciseSchema.safeParse(body);

    console.log({ ...parsedBody.data, templateId, id: exerciceId });

    if (!parsedBody.success) {
      return apiResponse({
        message: "Invalid request body",
        success: false,
        req: req,
        log: {
          message: "Invalid request body",
          metadata: {
            body,
            error: parsedBody.error.message,
            parsedBodyData: removeUndefined(parsedBody.data),
            parsedBodyError: safeStringify(parsedBody.error),
          },
        },
      });
    }
    try {
      const exercice = await prisma.workoutTemplateExercise.update({
        where: {
          id: exerciceId,
          workoutTemplate: {
            ownerId: userId,
            id: templateId,
          },
        },
        data: parsedBody.data,
      });

      await prisma.workoutTemplate.update({
        where: {
          ownerId: userId,
          id: templateId,
        },
        data: { updatedAt: new Date() },
      });

      return apiResponse({
        message: "Successfully updated workoutTemplateExercice",
        data: exercice,
        success: true,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return apiResponse({
          message: "workoutTemplateExercise not found",
          success: false,
          status: 404,
          req: req,
          log: {
            message: "workoutTemplateExercise not found",
            internalError: error,
            metadata: {
              templateId,
              exerciceId,
            },
          },
        });
      }
      throw error;
    }
  }
);

export const DELETE = withErrorHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string; exerciceId: string }> }
  ) => {
    const userId = req.headers.get("x-user-id") as string; //From middleware;
    const { templateId, exerciceId } = await params;

    try {
      const exercice = await prisma.workoutTemplateExercise.delete({
        where: {
          id: exerciceId,
          workoutTemplate: {
            ownerId: userId,
            id: templateId,
          },
        },
      });

      await prisma.workoutTemplate.update({
        where: {
          ownerId: userId,
          id: templateId,
        },
        data: { updatedAt: new Date() },
      });

      return apiResponse({
        message: "Successfully deleted workoutTemplateExercice",
        data: exercice,
        success: true,
        status: 200,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return apiResponse({
          message: "workoutTemplateExercise not found",
          success: true,
        });
      }
      throw error;
    }
  }
);
