"use client";

import AppShell from "@/components/AppShell";
import { currentAdminUser } from "@/lib/mock-data";
import { Search, Filter, ShieldAlert, Activity, User, FileEdit } from "lucide-react";
import { useState } from "react";

// Mock Audit Logs
const mockLogs = [
  { id: "log-1", user: "Admin User", action: "User Creation", target: "John Doe (Mentee)", date: new Date().toISOString(), type: "auth" },
  { id: "log-2", user: "Dr. Sharma", action: "Deleted Material", target: "DBMS Midterm Info", date: new Date(Date.now() - 3600000).toISOString(), type: "content" },
  { id: "log-3", user: "Prof. Anjali", action: "Verified Achievement", target: "Smart India Hackathon (Mentee: Rajesh)", date: new Date(Date.now() - 7200000).toISOString(), type: "validation" },
  { id: "log-4", user: "Admin User", action: "Modified System Settings", target: "Global Notice Board", date: new Date(Date.now() - 86400000).toISOString(), type: "system" },
  { id: "log-5", user: "System", action: "Auto-Allocated Mentees", target: "42 Students", date: new Date(Date.now() - 172800000).toISOString(), type: "system" },
];

export default function AdminAudit() {
  const user = currentAdminUser;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "auth" | "content" | "validation" | "system">("all");

  const filteredLogs = mockLogs.filter(log => {
    const matchSearch = log.user.toLowerCase().includes(search.toLowerCase()) || 
                        log.action.toLowerCase().includes(search.toLowerCase()) || 
                        log.target.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || log.type === filter;
    return matchSearch && matchFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "auth": return <User className="w-4 h-4 text-accent" />;
      case "content": return <FileEdit className="w-4 h-4 text-secondary" />;
      case "validation": return <Activity className="w-4 h-4 text-highlight" />;
      case "system": return <ShieldAlert className="w-4 h-4 text-danger" />;
      default: return <Activity className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <AppShell
      role="admin"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Audit Logs</h1>
        <p className="text-text-muted text-sm mt-0.5">Track system-wide administrative and user activities</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, action, or target..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface rounded-button">
          {(["all", "auth", "content", "validation", "system"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3 py-1.5 rounded-button text-sm font-medium transition-all ${
                filter === r ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span className="capitalize">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Action</th>
              <th>Target Entity</th>
              <th>Performed By</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td>
                  <div className="w-8 h-8 rounded-full bg-surface-border/20 flex items-center justify-center">
                    {getIcon(log.type)}
                  </div>
                </td>
                <td className="font-medium text-text-primary">{log.action}</td>
                <td className="text-text-muted">{log.target}</td>
                <td>
                  <span className={`badge ${log.user === "System" ? "badge-danger" : "badge-secondary"}`}>
                    {log.user}
                  </span>
                </td>
                <td className="text-xs text-text-muted font-mono">
                  {new Date(log.date).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center text-text-muted">No audit logs match your search.</div>
        )}
      </div>
    </AppShell>
  );
}
