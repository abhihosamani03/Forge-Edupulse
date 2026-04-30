"use client";

import AppShell from "@/components/AppShell";
import { currentStudentUser } from "@/lib/mock-data";
import { useState } from "react";
import { User, Mail, Phone, Lock, Save, Bell, Shield } from "lucide-react";

export default function StudentSettings() {
  const [user, setUser] = useState(currentStudentUser);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setUser({
      ...user,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
    });
    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSaveSecurity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg("Password updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <AppShell
      role="student"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted text-sm mt-0.5">Manage your account preferences and profile</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-card bg-success/10 border border-success/20 text-success text-sm font-medium flex items-center gap-2 animate-fade-in-up">
          <Shield className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-surface-border pb-4">
              <User className="w-5 h-5 text-accent" />
              <h2 className="font-heading font-bold text-text-primary text-lg">Personal Information</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" disabled defaultValue={user.full_name} className="input opacity-50 cursor-not-allowed" />
                  <p className="text-xs text-text-muted mt-1">Name changes require admin approval.</p>
                </div>
                <div>
                  <label className="label">USN</label>
                  <input type="text" disabled defaultValue={user.usn} className="input opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input type="text" disabled defaultValue={user.department} className="input opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="label">Semester / Section</label>
                  <input type="text" disabled defaultValue={`Year ${user.year} - Sec ${user.section}`} className="input opacity-50 cursor-not-allowed" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-surface-border mt-4">
                <div>
                  <label className="label flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</label>
                  <input type="email" name="email" required defaultValue={user.email} className="input focus:border-accent" />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                  <input type="tel" name="phone" defaultValue={user.phone || ""} className="input focus:border-accent" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="btn-primary">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security Form */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-surface-border pb-4">
              <Lock className="w-5 h-5 text-text-primary" />
              <h2 className="font-heading font-bold text-text-primary text-lg">Security</h2>
            </div>
            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" required className="input focus:border-accent" />
                </div>
                <div className="hidden md:block"></div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" required className="input focus:border-accent" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" required className="input focus:border-accent" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preferences Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-surface-border pb-4">
              <Bell className="w-5 h-5 text-text-primary" />
              <h2 className="font-heading font-bold text-text-primary text-lg">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-text-primary">Email Alerts</span>
                <input type="checkbox" defaultChecked className="accent-accent w-4 h-4 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-text-primary">SMS Updates</span>
                <input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-text-primary">Mentorship Reminders</span>
                <input type="checkbox" defaultChecked className="accent-accent w-4 h-4 cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
