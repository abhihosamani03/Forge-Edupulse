"use client";

import AppShell from "@/components/AppShell";
import {
  mockProfiles,
  mockAllocations,
  mockAchievements,
  mockInteractions,
  mockGraceRequests,
  currentAdminUser,
} from "@/lib/mock-data";
import {
  Users,
  UserCheck,
  Trophy,
  AlertCircle,
  TrendingUp,
  Shield,
  Activity,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const user = currentAdminUser;

  const totalStudents = mockProfiles.filter((p) => p.role === "mentee").length;
  const totalFaculty = mockProfiles.filter((p) => p.role === "mentor").length;
  const totalAllocations = mockAllocations.filter((a) => a.is_active).length;
  const pendingAch = mockAchievements.filter((a) => a.status === "Pending");
  const pendingGrace = mockGraceRequests.filter((g) => g.status === "Pending");
  const totalNba = mockAchievements
    .filter((a) => a.status === "Verified")
    .reduce((sum, a) => sum + a.nba_points, 0);

  const recentAchievements = mockAchievements.slice(0, 5);
  const incompleteProfiles = mockProfiles.filter((p) => !p.is_profile_complete && p.role === "mentee");

  return (
    <AppShell
      role="admin"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Admin Overview</h1>
        <p className="text-text-muted text-sm mt-0.5">
          Platform health &amp; key metrics — Sahyadri College of Engineering &amp; Management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: totalStudents, icon: Users, color: "bg-accent/10 text-accent", href: "/admin/users?role=mentee" },
          { label: "Faculty / Mentors", value: totalFaculty, icon: UserCheck, color: "bg-secondary/10 text-secondary", href: "/admin/users?role=mentor" },
          { label: "Active Allocations", value: totalAllocations, icon: Activity, color: "bg-highlight/10 text-highlight", href: "/admin/allocations" },
          { label: "Total NBA Points", value: totalNba, icon: Trophy, color: "bg-success/10 text-success", href: "/admin/achievements" },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <div className="card card-interactive p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-sm">{label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-heading font-bold text-text-primary">{value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {(pendingAch.length > 0 || pendingGrace.length > 0 || incompleteProfiles.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {pendingAch.length > 0 && (
            <Link href="/admin/achievements?filter=Pending">
              <div className="card p-4 border-highlight/30 bg-highlight/5 flex items-center gap-3 hover:border-highlight/50 transition-colors cursor-pointer">
                <Trophy className="w-5 h-5 text-highlight flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-text-primary">{pendingAch.length} Achievements Pending</div>
                  <div className="text-xs text-text-muted">Awaiting faculty verification</div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
              </div>
            </Link>
          )}
          {pendingGrace.length > 0 && (
            <Link href="/admin/audit">
              <div className="card p-4 border-danger/30 bg-danger/5 flex items-center gap-3 hover:border-danger/50 transition-colors cursor-pointer">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-text-primary">{pendingGrace.length} Grace Requests</div>
                  <div className="text-xs text-text-muted">Pending mentor review (View Audit)</div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
              </div>
            </Link>
          )}
          {incompleteProfiles.length > 0 && (
            <Link href="/admin/users">
              <div className="card p-4 border-accent/30 bg-accent/5 flex items-center gap-3 hover:border-accent/50 transition-colors">
                <Users className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-text-primary">{incompleteProfiles.length} Incomplete Profiles</div>
                  <div className="text-xs text-text-muted">Students with missing data</div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
              </div>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department breakdown */}
        <div className="card p-5">
          <h2 className="font-heading font-semibold text-text-primary mb-4">Students by Department</h2>
          {["Computer Science", "Electronics"].map((dept) => {
            const count = mockProfiles.filter((p) => p.role === "mentee" && p.department === dept).length;
            const pct = Math.round((count / totalStudents) * 100);
            return (
              <div key={dept} className="flex items-center gap-3 mb-3">
                <div className="w-28 text-sm text-text-muted truncate">{dept}</div>
                <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: dept === "Computer Science" ? "#E8A87C" : "#7C9E87",
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-text-muted w-12 text-right">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>

        {/* Recent Achievement activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-text-primary">Recent Achievements</h2>
            <Link href="/admin/achievements" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((ach) => {
              const student = mockProfiles.find((p) => p.id === ach.student_id);
              return (
                <div key={ach.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    ach.status === "Verified" ? "bg-success" :
                    ach.status === "Pending" ? "bg-accent animate-pulse-soft" : "bg-danger"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text-primary truncate">{ach.title}</div>
                    <div className="text-xs text-text-muted">{student?.full_name} · {ach.nba_points} pts</div>
                  </div>
                  <span className={`badge text-[10px] ${
                    ach.status === "Verified" ? "badge-success" :
                    ach.status === "Pending" ? "badge-accent" : "badge-danger"
                  }`}>{ach.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mentorship coverage */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-heading font-semibold text-text-primary mb-4">Mentorship Allocations</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mentor</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Mentees Assigned</th>
                  <th>Interaction Sessions</th>
                </tr>
              </thead>
              <tbody>
                {mockProfiles.filter((p) => p.role === "mentor").map((mentor) => {
                  const allocs = mockAllocations.filter((a) => a.mentor_id === mentor.id && a.is_active);
                  const sessions = mockInteractions.filter((i) => i.mentor_id === mentor.id).length;
                  return (
                    <tr key={mentor.id}>
                      <td className="font-medium">{mentor.full_name}</td>
                      <td className="text-text-muted">{mentor.department}</td>
                      <td className="text-text-muted text-xs">{mentor.designation}</td>
                      <td>
                        <span className="badge badge-accent">{allocs.length}</span>
                      </td>
                      <td>
                        <span className="badge badge-secondary">{sessions}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
