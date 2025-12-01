"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081A3E] px-4">
      <div className="bg-[#0D224F] p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#1B345F]">

        <h2 className="text-2xl font-bold text-center text-white mb-3">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 bg-red-900/20 border border-red-700 p-2 rounded-lg mb-4 text-center">
            {error}
          </p>
        )}

        <input
          className="w-full mb-4 p-3 bg-[#0A1C3A] text-white border border-[#1C3056] rounded-lg"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full mb-4 p-3 bg-[#0A1C3A] text-white border border-[#1C3056] rounded-lg"
          placeholder="Email Address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 bg-[#0A1C3A] text-white border border-[#1C3056] rounded-lg"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="flex mb-6 bg-[#0A1C3A] p-1 rounded-lg border border-[#1C3056]">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-2 rounded-md ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-[#13274E]"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-md ${
              role === "admin"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-[#13274E]"
            }`}
          >
            Admin
          </button>
        </div>

        <button
          disabled={loading}
          onClick={submit}
          className="w-full bg-blue-600 py-3 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-300 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
