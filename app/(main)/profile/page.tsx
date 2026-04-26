import type { Metadata } from "next";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Award, 
  BookOpen, 
  ChevronRight,
  LogOut,
  ShieldCheck
} from "lucide-react";
import db from "@/src/db";
import { client } from "@/sanity/client";

export const metadata: Metadata = {
  title: "My Profile | SEC Portal",
  description: "View your account details and learning progress on the SEC Portal.",
};

async function getRecentProgress(userId: string) {
  try {
    const res = await db.query(
      `SELECT course_slug, started_at, last_module_slug 
       FROM public.course_progress 
       WHERE user_id = $1 
       ORDER BY started_at DESC LIMIT 3`,
      [userId]
    );
    return res.rows;
  } catch (e) {
    return [];
  }
}

export default async function ProfilePage() {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  const progress = await getRecentProgress(user.id);

  // Fetch course details for the progress items
  const courseDetails = progress.length > 0 ? await client.fetch(
    `*[_type == "course" && slug.current in $slugs]{
      title,
      "slug": slug.current,
      "thumbnail": thumbnail.asset->url,
      instructor
    }`,
    { slugs: progress.map(p => p.course_slug) }
  ) : [];

  const joinedDate = user.createdAt ? new Date(user.id.startsWith('user_') ? parseInt(user.id.split('_')[1], 36) : Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  }) : "Recent Member";

  return (
    <div className="max-w-full mx-auto pb-20">
      {/* Profile Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-2 text-left">My Profile</h1>
        <p className="text-gray-500 font-marcellus">Manage your account and track your guidance journey.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* User Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-50 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-[#1d5c19]/5 shadow-inner group">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Member"}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform group-hover:scale-110 duration-500"
                />
              ) : (
                <div className="w-full h-full bg-[#1d5c19]/5 flex items-center justify-center text-[#1d5c19] text-4xl font-bold">
                  {user.name?.[0].toUpperCase() || "M"}
                </div>
              )}
            </div>

            <h2 className="text-2xl font-serif text-gray-900 mb-1">{user.name}</h2>
            <div className="bg-[#1d5c19]/5 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1d5c19] mb-8">
              SEC Portal Member
            </div>

            <div className="w-full space-y-4 text-left border-t border-gray-50 pt-8">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1d5c19] transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-marcellus text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1d5c19] transition-colors">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-marcellus text-gray-900">{joinedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1d5c19] transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Account Status</p>
                  <p className="text-sm font-marcellus text-green-600 font-bold">Verified & Active</p>
                </div>
              </div>
            </div>

            <Link 
              href="/settings"
              className="mt-10 w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              <Settings size={16} /> Account Settings
            </Link>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent Progress */}
          <div className="bg-white rounded-[40px] p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1d5c19]/5 flex items-center justify-center text-[#1d5c19]">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-xl font-serif text-gray-900">Recent Progress</h3>
              </div>
              <Link href="/exclusive-courses" className="text-xs font-bold text-[#1d5c19] hover:underline uppercase tracking-widest">
                All Courses
              </Link>
            </div>

            <div className="space-y-4">
              {progress.length > 0 ? progress.map((p: any) => {
                const course = courseDetails.find((c: any) => c.slug === p.course_slug);
                if (!course) return null;
                return (
                  <Link 
                    key={p.course_slug}
                    href={`/exclusive-courses/${p.course_slug}/watch/${p.last_module_slug || ""}`}
                    className="flex items-center gap-6 p-4 rounded-[24px] border border-transparent hover:border-[#1d5c19]/10 hover:bg-[#1d5c19]/5 transition-all group"
                  >
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      {course.thumbnail && (
                        <Image src={course.thumbnail} alt={course.title} fill sizes="96px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate font-marcellus text-lg leading-tight group-hover:text-[#1d5c19] transition-colors">{course.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-marcellus uppercase tracking-widest">By {course.instructor}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#1d5c19] transition-all shadow-sm">
                      <ChevronRight size={18} />
                    </div>
                  </Link>
                );
              }) : (
                <div className="text-center py-12 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-marcellus">You haven&apos;t started any courses yet.</p>
                  <Link href="/exclusive-courses" className="inline-block mt-4 text-[#1d5c19] font-bold text-[10px] uppercase tracking-widest hover:underline">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Achievement Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1d5c19] rounded-[40px] p-8 lg:p-10 text-white shadow-xl shadow-[#1d5c19]/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 transition-transform group-hover:scale-125 duration-700">
                  <Award size={140} />
               </div>
               <div className="relative z-10">
                 <h3 className="text-xl font-serif mb-2">Member Growth</h3>
                 <p className="text-white/70 font-marcellus text-sm mb-6">Complete modules and engage with content to earn special badges and recognition.</p>
                 <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                       <Award size={18} />
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center group hover:bg-[#1d5c19]/5 transition-all">
               <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6 group-hover:bg-[#1d5c19] group-hover:text-white transition-all">
                  <Settings size={28} />
               </div>
               <h3 className="text-xl font-serif text-gray-900 mb-2">Need Help?</h3>
               <p className="text-gray-400 font-marcellus text-sm mb-6">Our support team is here to guide you through any technical issues.</p>
               <Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest text-[#1d5c19] hover:underline">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
