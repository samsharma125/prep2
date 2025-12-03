"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Palette,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  User,
  Key,
  Loader2,
  Sparkles,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState<any>(null);

  // Load real user data
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 selection:bg-blue-500/30">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 flex flex-col lg:flex-row gap-10">

        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
          <div className="px-2">
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="text-blue-500 fill-blue-500/20" size={24} />
              Settings
            </h1>
            <p className="text-slate-400 text-sm mt-2">Manage your preferences</p>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={<User size={18} />}
              label="Account"
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />

            <SidebarItem
              icon={<Palette size={18} />}
              label="Appearance"
              active={activeTab === "appearance"}
              onClick={() => setActiveTab("appearance")}
            />
          </nav>

          {/* MINI PROFILE CARD */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm mt-auto">

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              {user ? user.name?.substring(0, 2).toUpperCase() : "??"}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user ? user.name : "Loading..."}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user ? user.email : "Fetching email..."}
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {activeTab === "account" && <AccountSection />}
              {activeTab === "appearance" && <AppearanceSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------
   SIDEBAR ITEM
------------------------------------------- */

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <span className="relative z-10 flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </span>

      {active && (
        <motion.div
          layoutId="sidebar-glow"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"
        />
      )}

      <ChevronRight
        size={16}
        className={cn(
          "ml-auto transition-transform relative z-10",
          active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
        )}
      />
    </button>
  );
}

function AccountSection() {
  return (
    <div className="grid gap-8">
      <ChangePasswordCard />
    </div>
  );
}

/* ------------------------------------------
   APPEARANCE SECTION
------------------------------------------- */

function AppearanceSection() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
  }, []);

  const themes = [
    { id: "light", label: "Light Mode", icon: <Sun size={20} />, desc: "Clean & bright" },
    { id: "dark", label: "Dark Mode", icon: <Moon size={20} />, desc: "Easy on the eyes" },
    { id: "system", label: "System Sync", icon: <Monitor size={20} />, desc: "Match OS" },
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/20">
      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
        <Palette className="text-purple-400" /> Appearance
      </h3>
      <p className="text-slate-400 mt-2 mb-8">Customize the dashboard look.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTheme(t.id);
              localStorage.setItem("theme", t.id);
            }}
            className={cn(
              "p-4 rounded-2xl border",
              theme === t.id
                ? "bg-blue-600/10 border-blue-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div className="mb-3">{t.icon}</div>
            <div className="font-semibold">{t.label}</div>
            <div className="text-xs text-slate-500">{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------
   CHANGE PASSWORD SECTION
------------------------------------------- */

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();
    setLoading(false);

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
    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-10">
      <h3 className="text-2xl font-bold">Change Password</h3>
      <p className="text-slate-400 text-sm mb-6">Update your login password.</p>

      <div className="space-y-6 max-w-xl">
        <InputGroup
          label="Current Password"
          type="password"
          icon={<Key size={18} />}
          value={currentPassword}
          onChange={setCurrentPassword}
        />

        <InputGroup
          label="New Password"
          type="password"
          icon={<Lock size={18} />}
          value={newPassword}
          onChange={setNewPassword}
        />

        <InputGroup
          label="Confirm Password"
          type="password"
          icon={<Lock size={18} />}
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </div>

      {error && <p className="text-red-400 mt-4">{error}</p>}
      {msg && <p className="text-green-400 mt-4">{msg}</p>}

      <div className="flex justify-end mt-6">
        <SaveButton
          label="Update Password"
          onClick={submit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}

function InputGroup({ label, icon, type, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-300">{label}</label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0F1623] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-200"
        />
      </div>
    </div>
  );
}

function SaveButton({ onClick, isLoading, label }: any) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-xl text-white font-medium shadow-lg flex items-center gap-2 disabled:opacity-50"
    >
      {isLoading && <Loader2 className="animate-spin" size={18} />}
      {label}
    </button>
  );
}
