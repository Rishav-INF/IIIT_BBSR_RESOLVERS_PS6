import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI || "mongodb+srv://andumandu6:andumandu6@cluster0.eh098m7.mongodb.net/"
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Stop the server if DB connection fails
  }
};
export default connectDB;