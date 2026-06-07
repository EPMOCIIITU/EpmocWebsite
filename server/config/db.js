const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Read the DB connection string from the environment
    const dbUri = process.env.DB_CON;
    
    if (!dbUri) {
      console.error('Error: DB_CON is not defined in the environment variables.');
      process.exit(1);
    }

    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
