"use client";

import AppShell from "@/components/AppShell";
import { mockProfiles, currentAdminUser } from "@/lib/mock-data";
import { Users, Search, Filter, UserPlus, MoreVertical, X } from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const user = currentAdminUser;
  const [users, setUsers] = useState(mockProfiles);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "mentee" | "mentor" | "admin">(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      return (url.searchParams.get("role") as any) || "all";
    }
    return "all";
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const filtered = users.filter((p) => {
    const matchRole = roleFilter === "all" || p.role === roleFilter;
    const matchSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.usn ?? p.employee_id ?? "").toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    if (editingUser) {
      setUsers(users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            role: fd.get("role") as any,
            full_name: fd.get("full_name") as string,
            email: fd.get("email") as string,
            department: fd.get("department") as string,
            usn: fd.get("role") === "mentee" ? (fd.get("id_number") as string) : u.usn,
            employee_id: fd.get("role") !== "mentee" ? (fd.get("id_number") as string) : u.employee_id,
          };
        }
        return u;
      }));
      setEditingUser(null);
    } else {
      const newProfile: any = {
        id: "usr-" + Date.now(),
        role: fd.get("role"),
        full_name: fd.get("full_name"),
        email: fd.get("email"),
        department: fd.get("department"),
        is_profile_complete: false,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      if (newProfile.role === "mentee") {
        newProfile.usn = fd.get("id_number") as string;
      } else {
        newProfile.employee_id = fd.get("id_number") as string;
      }
      setUsers([newProfile, ...users]);
      setShowAddModal(false);
    }
  };

  return (
    <AppShell
      role="admin"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">User Management</h1>
          <p className="text-text-muted text-sm mt-0.5">{users.length} total users on the platform</p>
        </div>
        <button onClick={() => { setEditingUser(null); setShowAddModal(true); }} className="btn-primary btn-sm">
          <UserPlus className="w-3.5 h-3.5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, USN..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface rounded-button">
          {(["all", "mentee", "mentor", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-button text-sm font-medium transition-all ${
                roleFilter === r ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {r === "all" ? "All" : r === "mentee" ? "Students" : r === "mentor" ? "Faculty" : "Admins"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>ID / USN</th>
                <th>Email</th>
                <th>Profile</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile) => (
                <tr key={profile.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                        {profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-text-primary whitespace-nowrap">{profile.full_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      profile.role === "admin" ? "badge-highlight" :
                      profile.role === "mentor" ? "badge-secondary" : "badge-accent"
                    }`}>
                      {profile.role === "mentee" ? "Student" : profile.role === "mentor" ? "Faculty" : "Admin"}
                    </span>
                  </td>
                  <td className="text-text-muted">{profile.department ?? "–"}</td>
                  <td className="font-mono text-xs text-text-muted">{profile.usn ?? profile.employee_id ?? "–"}</td>
                  <td className="text-text-muted text-xs">{profile.email}</td>
                  <td>
                    <span className={`badge ${profile.is_profile_complete ? "badge-success" : "badge-danger"}`}>
                      {profile.is_profile_complete ? "Complete" : "Incomplete"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${profile.is_active ? "badge-success" : "badge-danger"}`}>
                      {profile.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setEditingUser(profile)} className="btn-icon">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">{editingUser ? "Edit User Profile" : "Add New User"}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" name="full_name" required defaultValue={editingUser?.full_name} className="input h-[42px] px-3 border-border bg-input-bg text-text-primary" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="label">Account Role</label>
                  <select name="role" required defaultValue={editingUser?.role || "mentee"} className="input h-[42px] px-3 border-border bg-input-bg text-text-primary rounded-input outline-none focus:border-accent">
                    <option value="mentee">Student</option>
                    <option value="mentor">Faculty / Mentor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" name="email" required defaultValue={editingUser?.email} className="input h-[42px] px-3 border-border bg-input-bg text-text-primary" placeholder="user@sahyadri.edu.in" />
                </div>
                <div>
                  <label className="label">Department</label>
                  <select name="department" defaultValue={editingUser?.department || "Computer Science"} className="input h-[42px] px-3 border-border bg-input-bg text-text-primary rounded-input outline-none focus:border-accent">
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Science">Information Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label">USN / Employee ID</label>
                  <input type="text" name="id_number" required defaultValue={editingUser?.usn || editingUser?.employee_id} className="input h-[42px] px-3 border-border bg-input-bg text-text-primary font-mono text-sm" placeholder="e.g. 4SH..." />
                </div>
              </div>
              <div className="pt-4 border-t border-surface-border flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">{editingUser ? "Save Changes" : "Create Account"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
