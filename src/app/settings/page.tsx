"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Palette,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

export default function SettingsPage() {
  const [section, setSection] = useState("account");

  return (
    <div className="min-h-screen bg-[#0d1b2a] p-6 md:p-10 flex gap-8 text-white">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white/5 backdrop-blur-xl rounded-3xl 
      border border-white/10 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <h2 className="text-2xl font-bold mb-6 text-blue-300">Settings</h2>

        <nav className="space-y-2">
          <SidebarButton
            icon={<Lock size={20} />}
            label="Account Security"
            active={section === "account"}
            onClick={() => setSection("account")}
          />

          <SidebarButton
            icon={<Palette size={20} />}
            label="Theme & Appearance"
            active={section === "appearance"}
            onClick={() => setSection("appearance")}
          />
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1">
        {section === "account" && <AccountSecurity />}
        {section === "appearance" && <AppearanceSettings />}
      </main>
    </div>
  );
}

/* Sidebar Button */
function SidebarButton({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
        ${active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
        }
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronRight
        size={18}
        className={`ml-auto ${
          active ? "translate-x-1 opacity-90" : "opacity-40"
        }`}
      />
    </button>
  );
}

/* ACCOUNT SECURITY */
function AccountSecurity() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function updatePassword() {
    setError("");
    setSuccess("");

    if (newPass !== confirmPass) {
      setError("New passwords do not match!");
      return;
    }

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPass, newPass }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    setSuccess("Password updated successfully!");
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-xl">
      <h3 className="text-3xl font-semibold text-blue-300 mb-8">
        Account Security
      </h3>

      <div className="space-y-6">
        <Input label="Current Password" type="password" value={oldPass} onChange={setOldPass} />
        <Input label="New Password" type="password" value={newPass} onChange={setNewPass} />
        <Input label="Confirm New Password" type="password" value={confirmPass} onChange={setConfirmPass} />
      </div>

      {error && <ErrorBox text={error} />}
      {success && <SuccessBox text={success} />}

      <button
        onClick={updatePassword}
        className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
      >
        Update Password
      </button>
    </div>
  );
}

/* -------------------------------
   THEME & APPEARANCE (UPGRADED)
---------------------------------- */
function AppearanceSettings() {
  const [theme, setTheme] = useState("system");

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  function applyTheme(t: string) {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    if (t === "light") root.classList.add("light");
    if (t === "dark") root.classList.add("dark");
    if (t === "system") {
      const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(sysDark ? "dark" : "light");
    }

    localStorage.setItem("theme", t);
  }

  const options = [
    { id: "light", label: "Light Mode", icon: <Sun size={18} /> },
    { id: "dark", label: "Dark Mode", icon: <Moon size={18} /> },
    { id: "system", label: "System Default", icon: <Monitor size={18} /> },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-xl">
      <h3 className="text-3xl font-semibold text-blue-300 mb-8">
        Theme & Appearance
      </h3>

      <div className="flex flex-col gap-3 max-w-sm">
        {options.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTheme(t.id);
              applyTheme(t.id);
            }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all
              ${
                theme === t.id
                  ? "bg-blue-600/30 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-900/40"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {t.icon}
              <span className="text-sm font-medium">{t.label}</span>
            </div>

            {theme === t.id && (
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            )}
          </button>
        ))}
      </div>

      <p className="mt-6 text-gray-400 text-sm">
        Your theme is saved automatically.
      </p>
    </div>
  );
}

/* INPUT */
function Input({ label, type, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 mt-1 bg-white/10 border border-white/20 rounded-xl 
        focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

/* ERROR & SUCCESS */
function ErrorBox({ text }: any) {
  return (
    <p className="text-red-400 mt-4 bg-red-900/20 p-3 rounded-xl border border-red-700/30">
      {text}
    </p>
  );
}

function SuccessBox({ text }: any) {
  return (
    <p className="text-green-400 mt-4 bg-green-900/20 p-3 rounded-xl border border-green-700/30">
      {text}
    </p>
  );
}
