export const dynamic = 'force-dynamic'

import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import getProfileData from '@/lib/profile'
import { withErrorHandler } from '@/utils/errorHandler'
import { apiResponse } from '@/utils/apiResponse'

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ programId: string }> }) => {
    const { programId } = await params

    const workoutProgram = await prisma.workoutProgram.findUnique({
      where: {
        id: programId,
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        workoutTemplateLinks: {
          where: {
            deletedAt: null,
          },
          include: {
            workoutTemplate: {
              include: {
                exercises: {
                  include: {
                    exercise: true,
                  },
                },
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!workoutProgram) {
      return apiResponse({
        message: 'Workout program not found',
        success: false,
        status: 404,
      })
    }

    if (!workoutProgram.owner.id) {
      return apiResponse({
        message: "Program's user not found or is deleted",
        success: false,
        status: 404,
      })
    }

    return apiResponse({
      message: 'Successfully found program',
      data: {
        workoutProgram: workoutProgram,
        user: workoutProgram.owner,
      },
      success: true,
    })
  }
)
