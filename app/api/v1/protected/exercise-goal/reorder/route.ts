export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withErrorHandler } from '@/utils/errorHandler'
import { apiResponse } from '@/utils/apiResponse'
import { reorderExerciseGoalsSchema } from '@/lib/zod/user'

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
    const { goals } = parsedData.data

    // Verify all goals belong to the user
    const goalIds = goals.map(g => g.goalId)
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

    // Update each goal with its new order
    await Promise.all(
      goals.map(({ goalId, order }) =>
        prisma.exerciseGoal.update({
          where: { id: goalId, userId },
          data: { order },
        })
      )
    )

    return apiResponse({
      message: 'Successfully reordered exercise goals',
      success: true,
    })
  } catch (error) {
    throw error
  }
})


