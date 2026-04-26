import type { Metadata } from "next";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  CreditCard,
  ChevronRight,
  Info,
  Lock,
  Mail,
  Smartphone
} from "lucide-react";
import ThemeSettings from "../../components/settings/ThemeSettings";

export const metadata: Metadata = {
  title: "Account Settings | SEC Portal",
  description: "Manage your account preferences and security on the SEC Portal.",
};

export default async function SettingsPage() {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  return (
    <div className="max-w-full mx-auto pb-20">
      <header className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-500 font-marcellus">Customize your experience and manage your personal data.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden xl:block xl:col-span-3">
          <nav className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm sticky top-32">
            <ul className="space-y-1">
              <li>
                <a href="#profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1d5c19]/5 text-[#1d5c19] font-bold text-sm">
                  <User size={18} /> Profile
                </a>
              </li>
              <li>
                <a href="#security" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all font-bold text-sm">
                  <Shield size={18} /> Security
                </a>
              </li>
              <li>
                <a href="#notifications" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all font-bold text-sm">
                  <Bell size={18} /> Notifications
                </a>
              </li>
              <li>
                <a href="#appearance" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all font-bold text-sm">
                  <Palette size={18} /> Appearance
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="xl:col-span-9 space-y-10">
          {/* Profile Section */}
          <section id="profile" className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1d5c19]/5 flex items-center justify-center text-[#1d5c19]">
                <User size={24} />
              </div>
              <h3 className="text-2xl font-serif text-gray-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-2">Full Name</label>
                  <div className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-marcellus text-gray-900 flex items-center justify-between group hover:bg-white hover:border-[#1d5c19]/10 transition-all">
                    <span>{user.name}</span>
                    <Lock size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 ml-2">Managed via Auth Provider</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-2">Email Address</label>
                  <div className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-marcellus text-gray-900 flex items-center justify-between group hover:bg-white hover:border-[#1d5c19]/10 transition-all">
                    <span>{user.email}</span>
                    <Lock size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-[32px] p-8 border border-dashed border-gray-200">
                 <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white shadow-lg">
                   {user.image ? (
                     <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                   ) : (
                     <div className="w-full h-full bg-[#1d5c19]/5 flex items-center justify-center text-[#1d5c19] text-2xl font-bold">
                       {user.name?.[0].toUpperCase()}
                     </div>
                   )}
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Profile Picture</p>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#be1d51]/5 flex items-center justify-center text-[#be1d51]">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-serif text-gray-900">Security & Access</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 rounded-[24px] border border-gray-50 hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-gray-900">
                      <Lock size={18} />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 font-marcellus">Password</h4>
                     <p className="text-xs text-gray-400">Last changed 3 months ago</p>
                   </div>
                </div>
                <button className="px-6 py-2 rounded-xl border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">Update</button>
              </div>

              <div className="flex items-center justify-between p-6 rounded-[24px] border border-gray-50 hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-gray-900">
                      <Smartphone size={18} />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 font-marcellus">Two-Factor Authentication</h4>
                     <p className="text-xs text-gray-400">Add an extra layer of security</p>
                   </div>
                </div>
                <button className="px-6 py-2 rounded-xl bg-[#1d5c19] text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#1d5c19]/20 transition-all">Enable</button>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section id="appearance" className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                <Palette size={24} />
              </div>
              <h3 className="text-2xl font-serif text-gray-900">Appearance & Theme</h3>
            </div>
            
            <ThemeSettings />
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50/50 rounded-[40px] p-8 lg:p-12 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-serif text-red-900 mb-1">Delete Account</h3>
              <p className="text-sm text-red-600/70 font-marcellus">Permanently remove your account and all your course progress. This action is irreversible.</p>
            </div>
            <button className="px-8 py-4 rounded-2xl bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
              Request Deletion
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
