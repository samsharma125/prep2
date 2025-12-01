// app/dashboard/page.tsx
import Sidebar from "@/components/Sidebar";
import ChatWidget from "@/components/ChatWidget";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // FIX: cookies() is async in Next.js 16
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // verify token
  let auth;
  try {
    auth = verifyToken(token);
  } catch (err) {
    redirect("/login");
  }

  return (
    <div className="bg-[#0d1b2a] text-white min-h-screen">
      <Sidebar role={auth.role} auth={auth} />

  <main className="pt-20 p-6">
  <h1 className="text-3xl font-bold mb-8 text-blue-400">
    Welcome Back, <span className="max-sm:block">{auth.name} 👋</span>
  </h1>

  {/* Top Row - 4 Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <div className="p-6 bg-[#142132] rounded-2xl border border-[#1e2f47]/40">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">Activity</h2>
      <p className="text-gray-300 text-sm">Your recent activity and updates appear here.</p>
    </div>

    <div className="p-6 bg-[#142132] rounded-2xl border border-[#1e2f47]/40">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">Mock Test Summary</h2>
      <p className="text-gray-300 text-sm">Latest test scores and interview insights.</p>
    </div>

    <div className="p-6 bg-[#142132] rounded-2xl border border-[#1e2f47]/40">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">Assignments</h2>
      <p className="text-gray-300 text-sm">Track upcoming & completed assignments.</p>
    </div>

    <div className="p-6 bg-[#142132] rounded-2xl border border-[#1e2f47]/40">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">Calendar</h2>
      <p className="text-gray-300 text-sm">View lectures, exams & important events.</p>
    </div>
  </div>

  {/* Bottom Row */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div className="p-6 bg-[#142132] rounded-2xl border border-[#1e2f47]/40">
      <h3 className="text-xl font-semibold text-blue-300 mb-3">Recent Activity</h3>
      <p className="text-gray-300 text-sm">No recent activity available at the moment.</p>
    </div>

    <div className="p-6 bg-[#142132] rounded-2xl border border-[#1e2f47]/40">
      <h3 className="text-xl font-semibold text-blue-300 mb-3">Upcoming Deadlines</h3>
      <p className="text-gray-300 text-sm">You're all caught up! No deadlines right now.</p>
    </div>
  </div>
</main>


      <ChatWidget />
    </div>
  );
}
