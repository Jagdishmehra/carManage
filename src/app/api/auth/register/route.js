import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return new Response(JSON.stringify({ token }), { status: 201 });
}
