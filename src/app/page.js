"use client";

import Link from "next/link";

const HomePage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-4/5 max-w-4xl text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Car Management App 🚗
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Effortlessly manage your car inventory! Add, edit, view, and delete
          cars, complete with images, descriptions, and tags. Start by creating
          an account or logging in.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-800 transition duration-300"
          >
            Sign Up
          </Link>
          <Link
            href="/cars"
            className="px-6 py-3 bg-gray-700 text-white text-lg rounded-lg hover:bg-gray-900 transition duration-300"
          >
            View Cars
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
