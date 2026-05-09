"use client";

import AppShell from "@/components/AppShell";
import { mockAchievements, mockProfiles, currentAdminUser } from "@/lib/mock-data";
import { Trophy, CheckCircle2, XCircle, Star, Clock } from "lucide-react";
import { useState } from "react";

export default function AdminAchievements() {
  const user = currentAdminUser;
  const [filter, setFilter] = useState<"all" | "Verified" | "Pending" | "Rejected">(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      return (url.searchParams.get("filter") as any) || "all";
    }
    return "all";
  });

  const filtered = filter === "all" ? mockAchievements : mockAchievements.filter((a) => a.status === filter);

  return (
    <AppShell
      role="admin"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Achievement Registry</h1>
        <p className="text-text-muted text-sm mt-0.5">All student achievements across the platform</p>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending", count: mockAchievements.filter(a => a.status === "Pending").length, color: "text-accent" },
          { label: "Verified", count: mockAchievements.filter(a => a.status === "Verified").length, color: "text-success" },
          { label: "Total NBA pts", count: mockAchievements.filter(a => a.status === "Verified").reduce((s, a) => s + a.nba_points, 0), color: "text-highlight" },
        ].map(({ label, count, color }) => (
          <div key={label} className="card p-5 text-center">
            <div className={`text-3xl font-heading font-bold ${color}`}>{count}</div>
            <div className="text-text-muted text-sm mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {(["all", "Pending", "Verified", "Rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm rounded-full border ${
              filter === f ? "bg-accent text-background border-accent" : "bg-transparent text-text-muted border-surface-border hover:text-text-primary"
            }`}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Achievement</th>
              <th>Category</th>
              <th>Level</th>
              <th>NBA pts</th>
              <th>Status</th>
              <th>Verified By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ach) => {
              const student = mockProfiles.find((p) => p.id === ach.student_id);
              return (
                <tr key={ach.id}>
                  <td>
                    <div className="text-sm font-medium text-text-primary">{student?.full_name}</div>
                    <div className="text-xs text-text-muted">{student?.usn}</div>
                  </td>
                  <td>
                    <div className="text-sm text-text-primary font-medium">{ach.title}</div>
                    <div className="text-xs text-text-muted">{ach.issuing_body}</div>
                  </td>
                  <td><span className="badge badge-accent">{ach.category}</span></td>
                  <td className="text-text-muted text-sm">{ach.level ?? "–"}</td>
                  <td>
                    <span className="flex items-center gap-1 text-accent font-semibold text-sm">
                      <Star className="w-3 h-3" />{ach.nba_points}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ach.status === "Verified" ? "badge-success" : ach.status === "Pending" ? "badge-accent" : "badge-danger"}`}>
                      {ach.status}
                    </span>
                  </td>
                  <td className="text-xs text-text-muted font-medium">
                    {ach.status === "Verified" ? "Dr. Sharma (Mentor)" : ach.status === "Rejected" ? "System" : "–"}
                  </td>
                  <td className="text-text-muted text-xs">
                    {ach.date ? new Date(ach.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "–"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
