"use client";

import AppShell from "@/components/AppShell";
import { currentAdminUser } from "@/lib/mock-data";
import { Save, Shield, Settings2, Globe, Server, Key } from "lucide-react";
import { useState } from "react";

export default function AdminSettings() {
  const user = currentAdminUser;
  const [successMsg, setSuccessMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg("System settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 1000);
  };

  return (
    <AppShell
      role="admin"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">System Settings</h1>
        <p className="text-text-muted text-sm mt-0.5">Configure global platform parameters and integrations</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-card bg-success/10 border border-success/20 text-success text-sm font-medium flex items-center gap-2 animate-fade-in-up">
          <Shield className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Platform Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-surface-border pb-4">
              <Globe className="w-5 h-5 text-accent" />
              <h2 className="font-heading font-bold text-text-primary text-lg">General Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Institution Name</label>
                  <input type="text" defaultValue="R.V. College of Engineering" className="input" />
                </div>
                <div>
                  <label className="label">Institution Code</label>
                  <input type="text" defaultValue="RVCE" className="input" />
                </div>
                <div>
                  <label className="label">Current Academic Year</label>
                  <select className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent" defaultValue="2024-2025">
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                <div>
                  <label className="label">Current Semester</label>
                  <select className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent" defaultValue="Even Semester">
                    <option value="Odd Semester">Odd Semester</option>
                    <option value="Even Semester">Even Semester</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Integration & APIs */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-surface-border pb-4">
              <Key className="w-5 h-5 text-secondary" />
              <h2 className="font-heading font-bold text-text-primary text-lg">Integrations (API Keys)</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Supabase URL</label>
                <input type="password" defaultValue="https://xyz.supabase.co" className="input" />
              </div>
              <div>
                <label className="label">Supabase Service Role Key</label>
                <input type="password" defaultValue="***********************************" className="input" />
              </div>
            </div>
          </div>
        </div>

        {/* System Features Toggle */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-surface-border pb-4">
              <Settings2 className="w-5 h-5 text-text-primary" />
              <h2 className="font-heading font-bold text-text-primary text-lg">Feature Flags</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-sm font-medium text-text-primary">Enable Campus Feed</div>
                  <div className="text-xs text-text-muted">Allow global announcements</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-accent w-4 h-4 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-sm font-medium text-text-primary">Achievement Verification</div>
                  <div className="text-xs text-text-muted">Require mentor approval</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-accent w-4 h-4 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-sm font-medium text-text-primary flex items-center gap-2">Maintenance Mode <span className="badge badge-danger text-[10px] py-0">Danger</span></div>
                  <div className="text-xs text-text-muted">Lockout standard users</div>
                </div>
                <input type="checkbox" className="accent-danger w-4 h-4 cursor-pointer" />
              </label>
            </div>
          </div>

          <div className="card p-6 bg-surface shadow-none border-surface-border">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-text-muted" />
              <h3 className="font-medium text-sm text-text-primary">System Status</h3>
            </div>
            <div className="space-y-1 text-xs font-mono text-text-muted">
              <div className="flex justify-between"><span>Version:</span><span>v2.1.0-beta</span></div>
              <div className="flex justify-between"><span>Database:</span><span className="text-success">Connected</span></div>
              <div className="flex justify-between"><span>Uptime:</span><span>99.98%</span></div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isSaving} className="btn-primary w-full">
              {isSaving ? <Server className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving Configuration..." : "Save System Changes"}
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
