import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getCarById, updateCar, deleteCar } from "@/lib/carServices";

export async function GET(req, { params }) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader);

    const car = await getCarById(params.id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ car });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req, { params }) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader);

    const car = await getCarById(params.id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const updates = await req.json();
    const updatedCar = await updateCar(params.id, updates);
    return NextResponse.json({ updatedCar });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader);

    const car = await getCarById(params.id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    await deleteCar(params.id);
    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
