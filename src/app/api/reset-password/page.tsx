"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setMsg("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Password changed successfully!");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081A3E] px-4">
      <div className="bg-[#0D224F] p-10 rounded-2xl w-full max-w-md border border-[#1B345F]">
        <h2 className="text-2xl font-bold text-white mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 bg-[#0A1C3A] border border-[#1C3056] text-white rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 mb-3">{error}</p>}
        {msg && <p className="text-green-400 mb-3">{msg}</p>}

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
 