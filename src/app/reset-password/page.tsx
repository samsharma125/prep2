"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    setError("");
    setMsg("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Password */}
      <input
        type="password"
        placeholder="Current Password"
        className="w-full p-3 bg-[#0A1C3A] border border-[#1C3056] text-white rounded-lg"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      {/* New Password */}
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 bg-[#0A1C3A] border border-[#1C3056] text-white rounded-lg"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full p-3 bg-[#0A1C3A] border border-[#1C3056] text-white rounded-lg"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <p className="text-red-400">{error}</p>}
      {msg && <p className="text-green-400">{msg}</p>}

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        onClick={submit}
      >
        Update
      </button>
    </div>
  );
}
