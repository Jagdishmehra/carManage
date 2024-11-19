import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { verifyToken } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary file upload
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export async function POST(req) {
  await connectDB();

  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader);
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    // Parse form data
    const formData = await req.formData();

    // Extract fields
    const title = formData.get("title");
    const description = formData.get("description");
    const tagsRaw = formData.get("tags");

    // Validate inputs
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Parse tags
    const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

    // Get image files
    const imageFiles = formData.getAll("images");

    if (imageFiles.length === 0) {
      return new NextResponse("No images uploaded", { status: 400 });
    }

    // Upload files to Cloudinary
    const uploadedImages = [];
    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const url = await uploadToCloudinary(buffer);
      uploadedImages.push(url);
    }

    // Save car details
    const car = new Car({
      user: user.id,
      title,
      description,
      tags,
      images: uploadedImages,
    });

    await car.save();

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Error adding car:", error);
    return new NextResponse(
      `Error adding car: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        status: 500,
      }
    );
  }
}

export async function GET(req) {
  await connectDB();
  const authHeader = req.headers.get("authorization");
  const user = verifyToken(authHeader);

  const cars = await Car.find({ user: user.id });
  return new Response(JSON.stringify(cars), { status: 200 });
}
