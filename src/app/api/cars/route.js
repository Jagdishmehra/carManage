import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const authHeader = req.headers.get("authorization");
  const user = verifyToken(authHeader);

  const { title, description, tags, images } = await req.json();
  if (!title || !description || images.length > 10)
    return new Response("Invalid input", { status: 400 });

  const car = new Car({ user: user.id, title, description, tags, images });
  await car.save();
  return new Response(JSON.stringify(car), { status: 201 });
}

export async function GET(req) {
  await connectDB();
  const authHeader = req.headers.get("authorization");
  const user = verifyToken(authHeader);

  const cars = await Car.find({ user: user.id });
  return new Response(JSON.stringify(cars), { status: 200 });
}
