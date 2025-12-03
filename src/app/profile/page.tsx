"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Sparkles, LogOut } from "lucide-react";

// Fetches user details
async function fetchUser() {
  const res = await fetch("/api/profile/me", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchUser();
      if (!data) redirect("/login");
      setUser(data);
    })();
  }, []);

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="relative min-h-screen p-6 md:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">

      {/* Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/2 w-96 h-96 -translate-x-1/2 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">

        <h1 className="text-center text-5xl font-extrabold flex justify-center gap-4 text-white mb-14">
          <Sparkles className="text-blue-500" />
          Profile
        </h1>

        {/* USER PROFILE CARD */}
        <ProfileCard user={user} />

        {/* EDIT PROFILE CARD */}
        <EditProfileCard user={user} setUser={setUser} />

      </div>
    </div>
  );
}

/* ---------------------- Components ------------------------ */

function ProfileCard({ user }: any) {
  return (
    <div className="bg-slate-800/60 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl mb-12">

      <div className="flex flex-col items-center text-center gap-6">
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 
        flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white/10">
          {user.name[0].toUpperCase()}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          <p className="text-blue-300 text-sm mt-1">{user.role}</p>
        </div>
      </div>

      <div className="mt-10 space-y-5">
        <DetailRow icon={<User />} label="Full Name" value={user.name} />
        <DetailRow icon={<Mail />} label="Email Address" value={user.email} />
        <DetailRow icon={<Shield />} label="Role" value={user.role} />
      </div>

      {/* Logout */}
      <button className="mt-10 w-full flex items-center justify-center gap-2 text-red-400 py-3 
      border border-red-800/40 rounded-xl bg-red-900/10 hover:bg-red-900/20">
        <LogOut size={18} /> Log out
      </button>

    </div>
  );
}

/* ---------------------- EDIT PROFILE ------------------------ */

function EditProfileCard({ user, setUser }: any) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving...");

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    if (!res.ok) return setStatus(data.error);

    setStatus("Updated successfully!");
    setUser({ ...user, name, email });
  }

  return (
    <div className="bg-slate-800/50 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>

      <div className="space-y-5">
        <Input label="Full Name" value={name} onChange={setName} icon={<User />} />
        <Input label="Email" value={email} onChange={setEmail} icon={<Mail />} />
      </div>

      {status && <p className="mt-4 text-blue-400">{status}</p>}

      <button
        onClick={save}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl"
      >
        Save Changes
      </button>
    </div>
  );
}

/* ---------------------- UI Components ------------------------ */

function DetailRow({ icon, label, value }: any) {
  return (
    <div className="flex gap-5 items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
      <div className="p-3 bg-black/30 rounded-xl">{icon}</div>
      <div>
        <p className="text-slate-400 text-xs uppercase">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, icon, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <div className="relative mt-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0F1623] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-200"
        />
      </div>
    </div>
  );
}
