import 'dotenv/config'
import { config as dotenvConfig } from 'dotenv'
import { fetchAndStoreEvents } from '../services/eventService';
import { AppDataSource } from '../config/database';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenvConfig({ path: envFile });

// Function to run the seeding
const runSeeding = async (quantity: number) => {

  const connection = await AppDataSource.initialize();
  const queryRunner = connection.createQueryRunner();

  try {

    console.log('Dropping tables...');
    await queryRunner.query('DROP TABLE IF EXISTS `user_quiz_attempt_event`');
    await queryRunner.query('DROP TABLE IF EXISTS `user_quiz_attempt`');
    await queryRunner.query('DROP TABLE IF EXISTS `quiz_event`');
    await queryRunner.query('DROP TABLE IF EXISTS `event`');
    await queryRunner.query('DROP TABLE IF EXISTS `quiz`');
    await queryRunner.query('DROP TABLE IF EXISTS `user`');
    
    // Recreate tables by synchronizing
    console.log('Syncing schema...');
    await AppDataSource.synchronize();
    
    // Call the fetchAndStoreEvents function with the passed quantity
    await fetchAndStoreEvents(quantity);
    
    console.log(`Seeding completed with ${quantity} quizzes.`);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close the database connection
    await AppDataSource.destroy(); // Ensure connection is properly closed
  }
};

// Get the quantity parameter from the command line arguments
const args = process.argv.slice(2); // Get arguments after the script name
const quantity = args.length > 0 ? parseInt(args[0], 10) : 1; // Default to 5 if no argument is passed

// Run the seeding
runSeeding(quantity);
