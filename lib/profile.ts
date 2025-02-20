import { Profile } from '@prisma/client';
import { prisma } from './prisma';
import { createClient } from '@supabase/supabase-js';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const getProfileData = async (userId: Profile["id"]) => {

    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) return null;

    const profile = await prisma.profile.findUnique({
        where: { id: userId },
    });

    if (!profile) return null;

    const [workoutPrograms, workoutTemplates, exercises, workoutHistory] = await Promise.all([
        prisma.workoutProgram.findMany({
            where: { ownerId: userId },
            include: {
                workoutTemplates: {
                    include: {
                        workoutTemplate: {
                            include: {
                                exercises: { include: { exercise: true } },
                            },
                        },
                    },
                },
            },
        }),
        prisma.workoutTemplate.findMany({
            where: { ownerId: userId },
            include: {
                exercises: { include: { exercise: true } },
            },
        }),
        prisma.exercise.findMany({
            where: { ownerId: userId },
        }),
        prisma.workoutHistory.findMany({
            where: { ownerId: userId },
            include: {
                workoutTemplate: true,
                exercises: { include: { exercise: true } },
            },
        }),
    ]);

    console.log("user", {
        ...user.user,
        workoutPrograms: workoutPrograms,
        workoutTemplates: workoutTemplates,
        exercises: exercises,
        workoutHistory: workoutHistory
    });

    return {
        ...user.user,
        workoutPrograms: workoutPrograms,
        workoutTemplates: workoutTemplates,
        exercises: exercises,
        workoutHistory: workoutHistory
    };
};

export default getProfileData;  