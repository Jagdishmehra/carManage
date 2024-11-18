"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Logged in!");
      localStorage.setItem("token", data.token);
      router.replace("/cars");
    } else {
      toast.error(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-black mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 text-black border border-gray-400 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 text-black border border-gray-400 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 border border-gray-200 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
