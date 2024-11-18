import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    images: [{ type: String }], // Paths of uploaded images
  },
  { timestamps: true }
);

export default mongoose.models.Car || mongoose.model("Car", CarSchema);
