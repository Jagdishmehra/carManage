"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function CarCard({ car }) {
  const router = useRouter();
  //console.log("car card details from CarCard page: ", car);

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
      onClick={() => router.push(`/cars/${car._id}`)}
    >
      <div className="relative w-full h-40 mb-4">
        <img
          src={car?.images?.[0] || "test.jpg"}
          alt={car.title}
          className="w-full h-full text-gray-400 object-cover rounded-t-lg"
        />
      </div>
      <h2 className="text-lg text-gray-500 font-semibold truncate">
        {car.title}
      </h2>
      <p className="text-sm text-gray-500 truncate">{car.description}</p>
      <div className="mt-2">
        {car.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-500 text-xs font-medium px-2 py-1 rounded-full mr-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
