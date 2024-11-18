import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1)
      return console.log("already connected");
    await mongoose.connect(process.env.MONGO_URI, {});
  } catch (err) {
    console.error(err.message);
  }
};

export default connectDB;
