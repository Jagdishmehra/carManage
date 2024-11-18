import Car from "@/models/Car";
import connectDB from "./db";

export const getUserCars = async (userId) => {
  await connectDB();
  return Car.find({ owner: userId });
};

export const getCarById = async (carId) => {
  await connectDB();
  return Car.findById(carId);
};

export const createCar = async (carData) => {
  await connectDB();
  return Car.create(carData);
};

export const updateCar = async (carId, updates) => {
  await connectDB();
  return Car.findByIdAndUpdate(carId, updates, { new: true });
};

export const deleteCar = async (carId) => {
  await connectDB();
  return Car.findByIdAndDelete(carId);
};
