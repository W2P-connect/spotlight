export const dynamic = 'force-dynamic'

import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import getProfileData from '@/lib/profile'
import { withErrorHandler } from '@/utils/errorHandler'
import { apiResponse } from '@/utils/apiResponse'

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ templateId: string }> }) => {
    const { templateId } = await params

    // return apiResponse({
    //   success: true,
    //   message: 'Successfully found template',
    //   data: {
    //     workoutTemplate: {
    //       id: 'c7c7a820-f11c-4106-9a42-e626f8707503',
    //       name: 'Épaules / biceps',
    //       ownerId: '1089f690-96c7-4c90-9ce7-f2dad179d8cd',
    //       createdAt: '2025-05-16T14:25:18.191Z',
    //       updatedAt: '2025-11-23T07:50:21.105Z',
    //       deletedAt: null,
    //       archived: false,
    //       type: 'body',
    //       exercises: [
    //         {
    //           id: '2b172cd5-4171-4fc5-afcc-978d7c6af8ff',
    //           workoutTemplateId: 'c7c7a820-f11c-4106-9a42-e626f8707503',
    //           exerciseId: '6eff7ecb-2f08-4cca-9102-c2972f04c0bb',
    //           minReps: [8, 8, 8, 8],
    //           maxReps: [12, 12, 12, 12],
    //           createdAt: '2025-11-20T13:00:16.530Z',
    //           updatedAt: '2025-11-20T13:08:32.189Z',
    //           order: 0,
    //           supersetId: null,
    //           restTime: [120, 120, 120, 120],
    //           comment: 'banc incliné à 6',
    //           intensity: [0, 0, 0, 0],
    //           exercise: {
    //             id: '6eff7ecb-2f08-4cca-9102-c2972f04c0bb',
    //             name: 'Développé militaire haltères',
    //             isPublic: true,
    //             ownerId: null,
    //             createdAt: '2025-03-21T14:19:39.760Z',
    //             updatedAt: '2025-06-15T17:16:01.555Z',
    //             tags: [
    //               'dumbbell military press',
    //               'dumbbell shoulder press',
    //               'seated dumbbell press',
    //               'standing dumbbell press',
    //               'dumbbell overhead press',
    //             ],
    //           },
    //         },
    //         {
    //           id: 'c44d6b7d-1daa-4bf9-979c-075af5493477',
    //           workoutTemplateId: 'c7c7a820-f11c-4106-9a42-e626f8707503',
    //           exerciseId: 'cb3c5a56-b680-440e-afeb-a078faa89d2a',
    //           minReps: [12, 12, 12, 12],
    //           maxReps: [0, 0, 0, 0],
    //           createdAt: '2025-11-20T13:00:38.701Z',
    //           updatedAt: '2025-11-20T13:00:54.816Z',
    //           order: 1,
    //           supersetId: null,
    //           restTime: [90, 90, 90, 90],
    //           comment: '',
    //           intensity: [0, 0, 0, 0],
    //           exercise: {
    //             id: 'cb3c5a56-b680-440e-afeb-a078faa89d2a',
    //             name: 'Élévations latérales haltères',
    //             isPublic: true,
    //             ownerId: null,
    //             createdAt: '2025-03-21T14:19:39.760Z',
    //             updatedAt: '2025-06-15T16:16:01.555Z',
    //             tags: [
    //               'dumbbell lateral raises',
    //               'élévations latérales haltères',
    //               'lateral raises with dumbbells',
    //               'dumbbell lateral delt raise',
    //               'lateral raise haltères',
    //             ],
    //           },
    //         },
    //         {
    //           id: '62609134-e627-48c7-a07b-14edb1317a08',
    //           workoutTemplateId: 'c7c7a820-f11c-4106-9a42-e626f8707503',
    //           exerciseId: 'caeff74f-3e00-4d04-8ebd-3d0ace17ad16',
    //           minReps: [12, 12, 12, 12],
    //           maxReps: [0, 0, 0, 0],
    //           createdAt: '2025-11-20T13:01:30.137Z',
    //           updatedAt: '2025-11-20T13:23:09.797Z',
    //           order: 2,
    //           supersetId: null,
    //           restTime: [90, 90, 90, 90],
    //           comment: 'cran à 3',
    //           intensity: [0, 0, 0, 0],
    //           exercise: {
    //             id: 'caeff74f-3e00-4d04-8ebd-3d0ace17ad16',
    //             name: 'Élévation incliné arrière épaule',
    //             isPublic: false,
    //             ownerId: '1089f690-96c7-4c90-9ce7-f2dad179d8cd',
    //             createdAt: '2025-04-11T14:36:31.844Z',
    //             updatedAt: '2025-06-19T11:03:26.000Z',
    //             tags: ['Incline Rear Delt Raise', 'Oiseau incliné'],
    //           },
    //         },
    //         {
    //           id: '04b2e141-d21e-4824-8d8b-8627b2a7d83e',
    //           workoutTemplateId: 'c7c7a820-f11c-4106-9a42-e626f8707503',
    //           exerciseId: 'b1491dc5-1b70-46d3-8f26-d0c1dcb7865b',
    //           minReps: [8, 8, 8, 8],
    //           maxReps: [0, 0, 0, 0],
    //           createdAt: '2025-11-20T13:01:59.444Z',
    //           updatedAt: '2025-11-20T13:02:18.493Z',
    //           order: 3,
    //           supersetId: null,
    //           restTime: [90, 90, 90, 90],
    //           comment: '',
    //           intensity: [0, 0, 0, 0],
    //           exercise: {
    //             id: 'b1491dc5-1b70-46d3-8f26-d0c1dcb7865b',
    //             name: 'Curl biceps barre',
    //             isPublic: true,
    //             ownerId: null,
    //             createdAt: '2025-03-21T14:19:39.760Z',
    //             updatedAt: '2025-05-27T16:16:01.555Z',
    //             tags: [
    //               'barbell bicep curl',
    //               'curl barre',
    //               'barbell curl',
    //               'curl biceps barre',
    //               'bicep curl barre',
    //             ],
    //           },
    //         },
    //       ],
    //     },
    //     user: {
    //       displayName: 'Donatello SCARABINO (Dona)',
    //       firstName: 'Donatello',
    //       id: '97c2cab9-7454-4f45-8032-89991efe3f59',
    //       lastName: 'SCARABINO',
    //       profilePicture:
    //         'https://ymobpqvqfclwbahajscz.supabase.co/storage/v1/object/public/profile.pictures/97c2cab9-7454-4f45-8032-89991efe3f59.jpeg?t=1746435781106',
    //       username: 'Dona',
    //     },
    //   },
    // })

    const workoutTemplate = await prisma.workoutTemplate.findUnique({
      where: {
        id: templateId,
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
        exercises: {
          include: {
            exercise: true,
          },
        },
        workoutProgramLinks: {
          include: {
            workoutProgram: true,
          },
        },
      },
    })

    if (!workoutTemplate) {
      return apiResponse({
        message: 'Workout template not found',
        success: false,
        status: 404,
      })
    }

    if (!workoutTemplate.owner.id) {
      return apiResponse({
        message: "Template's user not found or is deleted",
        success: false,
        status: 404,
      })
    }

    return apiResponse({
      message: 'Successfully found template',
      data: {
        workoutTemplate: workoutTemplate,
        user: workoutTemplate.owner,
      },
      success: true,
    })
  }
)
