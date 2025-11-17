import "dotenv/config";
import { prisma } from '@/lib/prisma';
import { computeEpley1RM } from '@/lib/utils/oneRepMax';

/**
 * Script to fix rounding issues in WorkoutSetScore table
 * Recalculates and rounds all scores to 1 decimal place
 */
async function main() {
  console.log('🔧 Starting WorkoutSetScore rounding fix...\n');

  try {
    // Get total count of workout set scores
    const totalCount = await prisma.workoutSetScore.count();
    console.log(`📊 Found ${totalCount} workout set scores to process\n`);

    if (totalCount === 0) {
      console.log('✅ No workout set scores to process. Exiting.');
      process.exit(0);
    }

    // Process in batches to avoid memory issues
    const batchSize = 1000;
    let updated = 0;
    let unchanged = 0;
    let errors = 0;

    // Process all workout set scores in batches
    for (let skip = 0; skip < totalCount; skip += batchSize) {
      const scores = await prisma.workoutSetScore.findMany({
        skip,
        take: batchSize,
        orderBy: {
          createdAt: 'asc',
        },
      });

      for (const score of scores) {
        try {
          // Recalculate score with proper rounding
          const roundedScore = computeEpley1RM(score.weight, score.reps);

          // Only update if the score has changed (to avoid unnecessary updates)
          if (Math.abs(score.score - roundedScore) > 0.001) {
            await prisma.workoutSetScore.update({
              where: { id: score.id },
              data: { score: roundedScore },
            });
            updated++;
          } else {
            unchanged++;
          }

          // Log progress every 100 items
          if ((updated + unchanged) % 100 === 0) {
            console.log(`⏳ Processed ${updated + unchanged}/${totalCount} scores...`);
          }
        } catch (error) {
          errors++;
          console.error(
            `❌ Error processing score ${score.id}:`,
            error instanceof Error ? error.message : String(error)
          );
          // Continue processing other scores even if one fails
        }
      }

      // Log batch progress
      console.log(
        `📦 Batch complete: ${Math.min(skip + batchSize, totalCount)}/${totalCount} processed`
      );
    }

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Rounding Fix Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Unchanged (already correct): ${unchanged}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total: ${totalCount}`);
    console.log('='.repeat(50) + '\n');

    if (errors > 0) {
      console.warn('⚠️  Some scores failed to process. Check the errors above.');
      process.exit(1);
    } else {
      console.log('✅ Rounding fix completed successfully!');
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

