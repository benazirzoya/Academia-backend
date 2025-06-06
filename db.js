import mongoose from 'mongoose';

const connectDB = async () => {
  let attempts = 0;
  const maxRetries = 5;
  const retryDelay = 5000;

  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:5173/Academia";

  if (!mongoURI) {
    console.error('MONGO_URI is missing in environment variables.');
    process.exit(1);
  }

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log(' ✅ Connected to MongoDB successfully');
    } catch (err) {
      if (attempts < maxRetries) {
        attempts++;
        console.error(` MongoDB connection error: ${err.message}. Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        await connectWithRetry();
      } else {
        console.error(' Max retries reached. MongoDB connection failed.');
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

export default connectDB;
