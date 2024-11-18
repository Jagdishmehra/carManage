"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.replace("/");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/cars")}
        >
          Car Manager
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/cars/create")}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Add Car
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
