import "dotenv/config";
import { prisma } from '@/lib/prisma';

/**
 * Script to fix workout history types based on exercise intensity
 * - If intensity array has values other than 0 → type = "power"
 * - Otherwise → type = "body"
 */
async function main() {
  console.log('🚀 Starting WorkoutHistory type correction script...\n');

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
    let updated = 0;
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

          // Find the first exercise with non-empty intensity or maxReps arrays
          let exerciseToCheck = null;
          for (const exercise of workoutHistory.exercises) {
            const hasIntensity = exercise.intensity && exercise.intensity.length > 0;
            const hasMaxReps = exercise.maxReps && exercise.maxReps.length > 0;
            
            if (hasIntensity || hasMaxReps) {
              exerciseToCheck = exercise;
              break;
            }
          }

          // If no exercise found with data, skip
          if (!exerciseToCheck) {
            skipped++;
            console.log(`⏭️  Skipped workout history ${workoutHistory.id} (no exercise with intensity/maxReps)`);
            continue;
          }

          // Determine type based on intensity
          // If intensity has values other than 0, it's power, otherwise body
          const hasNonZeroIntensity = exerciseToCheck.intensity && 
            exerciseToCheck.intensity.length > 0 && 
            exerciseToCheck.intensity.some((val: number) => val !== 0);

          const newType = hasNonZeroIntensity ? 'power' : 'body';

          // Only update if type is different
          if (workoutHistory.type !== newType) {
            await prisma.workoutHistory.update({
              where: { id: workoutHistory.id },
              data: { type: newType },
            });

            updated++;
            console.log(
              `✅ Updated workout history ${workoutHistory.id}: ${workoutHistory.type} → ${newType}`
            );
          } else {
            console.log(
              `✓  Workout history ${workoutHistory.id} already has correct type: ${newType}`
            );
          }

          processed++;
          
          // Log progress every 10 processed items
          if (processed % 10 === 0) {
            console.log(`📈 Progress: ${processed}/${totalCount} workout histories...`);
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
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Skipped (no exercises/data): ${skipped}`);
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

