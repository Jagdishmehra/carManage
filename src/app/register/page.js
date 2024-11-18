"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registered successfully!");
        router.replace("/login");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Error registering user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow">
        <h1 className="text-2xl text-black font-bold mb-4">Register</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border border-gray-400 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-400 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white border border-gray-200 p-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}
