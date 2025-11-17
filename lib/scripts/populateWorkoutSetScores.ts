import "dotenv/config";
import { prisma } from '@/lib/prisma';
import { processWorkoutHistorySetScores } from '@/lib/utils/oneRepMax';

/**
 * Script to populate WorkoutSetScore table for all existing WorkoutHistory records
 * This script processes all workout histories and calculates set scores using the Epley formula
 */
async function main() {
  console.log('🚀 Starting WorkoutSetScore population script...\n');

  try {
    // Get total count of workout histories
    const totalCount = await prisma.workoutHistory.count({
      where: {
        deletedAt: null, // Only process non-deleted workout histories
      },
    });

    console.log(`📊 Found ${totalCount} workout histories to process\n`);

    if (totalCount === 0) {
      console.log('✅ No workout histories to process. Exiting.');
      process.exit(0);
    }

    // Process in batches to avoid memory issues
    const batchSize = 50;
    let processed = 0;
    let errors = 0;
    let skipped = 0;

    // Process all workout histories in batches
    for (let skip = 0; skip < totalCount; skip += batchSize) {
      const workoutHistories = await prisma.workoutHistory.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          exercises: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        skip,
        take: batchSize,
        orderBy: {
          createdAt: 'asc', // Process oldest first
        },
      });

      for (const workoutHistory of workoutHistories) {
        try {
          // Skip if no exercises
          if (!workoutHistory.exercises || workoutHistory.exercises.length === 0) {
            skipped++;
            console.log(`⏭️  Skipped workout history ${workoutHistory.id} (no exercises)`);
            continue;
          }

          // Transform exercises to the format expected by processWorkoutHistorySetScores
          const exercises = workoutHistory.exercises.map((exercise) => ({
            id: exercise.id,
            exerciseId: exercise.exerciseId,
            nbReps: exercise.nbReps,
            weight: exercise.weight,
          }));

          // Process this workout history
          await processWorkoutHistorySetScores(
            workoutHistory.id,
            workoutHistory.ownerId,
            exercises,
            'scripts/populateWorkoutSetScores'
          );

          processed++;
          
          // Log progress every 10 processed items
          if (processed % 10 === 0) {
            console.log(`✅ Processed ${processed}/${totalCount} workout histories...`);
          }
        } catch (error) {
          errors++;
          console.error(
            `❌ Error processing workout history ${workoutHistory.id}:`,
            error instanceof Error ? error.message : String(error)
          );
          // Continue processing other workout histories even if one fails
        }
      }

      // Log batch progress
      console.log(
        `📦 Batch complete: ${Math.min(skip + batchSize, totalCount)}/${totalCount} processed`
      );
    }

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Migration Summary:');
    console.log(`   ✅ Successfully processed: ${processed}`);
    console.log(`   ⏭️  Skipped (no exercises): ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total: ${totalCount}`);
    console.log('='.repeat(50) + '\n');

    if (errors > 0) {
      console.warn('⚠️  Some workout histories failed to process. Check the errors above.');
      process.exit(1);
    } else {
      console.log('✅ Migration completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

