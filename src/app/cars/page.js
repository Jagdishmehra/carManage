"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserProvider";

export default function CarList() {
  const { cars } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You need to log in first!", {
            position: "bottom-right",
          });
          router.replace("/login");
          return;
        }
        // fetch this in context app
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast.error("Something went wrong", { position: "bottom-right" });
      }
    };
    fetchCars();
  }, []);

  const filteredCars = cars.filter((car) => {
    const searchText = search.toLowerCase();
    return (
      car?.title?.toLowerCase().includes(searchText) ||
      car?.description?.toLowerCase().includes(searchText) ||
      (car?.tags || []).some((tag) => tag.toLowerCase().includes(searchText))
    );
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Cars</h1>
          <input
            type="text"
            placeholder="Search cars..."
            className="border rounded-lg p-2 w-1/3 text-black border-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => <CarCard key={car._id} car={car} />)
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No cars found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
