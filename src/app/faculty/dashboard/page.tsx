// app/faculty/dashboard/page.tsx
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FacultyDashboard() {
  // Next.js 16 → cookies() is async
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  let auth;

  try {
    auth = verifyToken(token);
  } catch (err) {
    redirect("/login");
  }

  // Only admin/faculty allowed
  if (auth.role !== "admin") {
    redirect("/dashboard"); // redirect students
  }

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white p-10">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-6 text-blue-400">
        Faculty Dashboard 👨‍🏫
      </h1>

      <p className="text-gray-300 mb-10">
        Welcome back, <span className="font-semibold text-blue-300">{auth.name}</span>!  
        Manage students, track progress, and post training materials.
      </p>

      {/* Simple Faculty UI Demo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#142132] p-6 rounded-2xl border border-[#1e2f47]/40">
          <h2 className="text-lg font-semibold text-blue-300 mb-2">
            Students List
          </h2>
          <p className="text-gray-300 text-sm">View and manage all registered students.</p>
        </div>

        <div className="bg-[#142132] p-6 rounded-2xl border border-[#1e2f47]/40">
          <h2 className="text-lg font-semibold text-blue-300 mb-2">
            Track Progress
          </h2>
          <p className="text-gray-300 text-sm">Monitor preparation status, assignments & tests.</p>
        </div>

        <div className="bg-[#142132] p-6 rounded-2xl border border-[#1e2f47]/40">
          <h2 className="text-lg font-semibold text-blue-300 mb-2">
            Upload Material
          </h2>
          <p className="text-gray-300 text-sm">Share study content, notes & resources.</p>
        </div>
      </div>
    </div>
  );
}
