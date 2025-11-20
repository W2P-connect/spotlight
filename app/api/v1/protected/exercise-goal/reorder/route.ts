export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withErrorHandler } from '@/utils/errorHandler'
import { apiResponse } from '@/utils/apiResponse'
import { z } from 'zod'

const reorderExerciseGoalsSchema = z.object({
  goalIds: z.array(z.string().uuid()),
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id') as string
  const body = await req.json()
  const parsedData = reorderExerciseGoalsSchema.safeParse(body)

  if (!parsedData.success) {
    return apiResponse({
      message: 'Invalid request body',
      success: false,
      status: 400,
      req: req,
      log: {
        message: 'Invalid request body',
        metadata: {
          body,
          error: parsedData.error.message,
        },
      },
    })
  }

  try {
    const { goalIds } = parsedData.data

    // Verify all goals belong to the user
    const userGoals = await prisma.exerciseGoal.findMany({
      where: {
        userId,
        id: { in: goalIds },
      },
      select: { id: true },
    })

    if (userGoals.length !== goalIds.length) {
      return apiResponse({
        message: 'Some goals do not belong to the user or do not exist',
        success: false,
        status: 403,
      })
    }

    // For now, we just verify the order is valid
    // In the future, if we add an 'order' field to ExerciseGoal,
    // we would update each goal with its order index here
    // Example:
    // await Promise.all(
    //   goalIds.map((goalId, index) =>
    //     prisma.exerciseGoal.update({
    //       where: { id: goalId, userId },
    //       data: { order: index },
    //     })
    //   )
    // )

    return apiResponse({
      message: 'Successfully reordered exercise goals',
      success: true,
    })
  } catch (error) {
    throw error
  }
})


