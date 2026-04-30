"use client";

import AppShell from "@/components/AppShell";
import {
  getMenteesForMentor,
  mockInteractions,
  mockAchievements,
  mockGraceRequests,
  mockCourses,
  currentMentorUser,
  calculateNbaScore,
} from "@/lib/mock-data";
import {
  Users,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Star,
  ChevronRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function MentorDashboard() {
  const user = currentMentorUser;
  const mentees = getMenteesForMentor(user.id);
  const allInteractions = mockInteractions.filter((i) => i.mentor_id === user.id);
  const pendingAch = mockAchievements.filter(
    (a) => mentees.some((m) => m.id === a.student_id) && a.status === "Pending"
  );
  const pendingGrace = mockGraceRequests.filter(
    (g) => mentees.some((m) => m.id === g.student_id) && g.status === "Pending"
  );
  const unacknowledgedInteractions = allInteractions.filter((i) => !i.is_acknowledged);
  const myCourses = mockCourses.filter((c) => c.faculty_id === user.id);

  const recentInteractions = [...allInteractions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <AppShell
      role="mentor"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Welcome, {user.full_name.split(" ").slice(0, 2).join(" ")} 👋
        </h1>
        <p className="text-text-muted text-sm mt-0.5">
          {user.designation} · {user.department} · {user.employee_id}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Mentees", value: mentees.length, icon: Users, color: "bg-accent/10 text-accent", href: "/mentor/mentees" },
          { label: "Pending Achievements", value: pendingAch.length, icon: Trophy, color: "bg-highlight/10 text-highlight", href: "/mentor/achievements" },
          { label: "Grace Requests", value: pendingGrace.length, icon: AlertCircle, color: pendingGrace.length > 0 ? "bg-danger/10 text-danger" : "bg-success/10 text-success", href: "/mentor/attendance" },
          { label: "My Courses", value: myCourses.length, icon: BookOpen, color: "bg-secondary/10 text-secondary", href: "/mentor/courses" },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="card card-interactive p-5 flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-sm">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-heading font-bold text-text-primary">{value}</span>
              <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentees Overview */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-text-primary">My Mentees</h2>
            <Link href="/mentor/mentees" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {mentees.map((mentee) => {
              const nba = calculateNbaScore(mentee.id);
              const hasIssues = !mentee.is_profile_complete;
              return (
                <div key={mentee.id} className="flex items-center gap-4 p-3 rounded-button hover:bg-accent-light transition-colors">
                  <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-accent text-sm font-bold flex-shrink-0">
                    {mentee.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{mentee.full_name}</span>
                      {hasIssues && (
                        <span className="badge badge-danger text-[10px]">Profile incomplete</span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted">{mentee.usn} · Year {mentee.year} {mentee.section}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-accent font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />{nba} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Pending Actions */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-text-primary mb-4">Pending Actions</h2>
            <div className="space-y-3">
              {pendingAch.length > 0 && (
                <Link href="/mentor/achievements" className="flex items-center gap-3 p-2.5 rounded-button bg-highlight/10 border border-highlight/20 hover:bg-highlight/15 transition-colors">
                  <Trophy className="w-4 h-4 text-highlight flex-shrink-0" />
                  <span className="text-sm text-text-primary">{pendingAch.length} achievement{pendingAch.length > 1 ? "s" : ""} to verify</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted ml-auto" />
                </Link>
              )}
              {pendingGrace.length > 0 && (
                <div onClick={() => alert("Redirecting to grace requests module...")} className="flex items-center gap-3 p-2.5 rounded-button bg-danger/10 border border-danger/20 hover:bg-danger/15 transition-colors group cursor-pointer">
                  <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                  <span className="text-sm text-text-primary">{pendingGrace.length} grace request{pendingGrace.length !== 1 ? "s" : ""} pending</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              )}
              {unacknowledgedInteractions.length > 0 && (
                <div onClick={() => alert("Please review these interaction reports")} className="flex items-center gap-3 p-2.5 rounded-button bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors group cursor-pointer">
                  <MessageSquare className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-text-primary">{unacknowledgedInteractions.length} session{unacknowledgedInteractions.length !== 1 ? "s" : ""} to acknowledge</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              )}
              {unacknowledgedInteractions.length === 0 && pendingAch.length === 0 && pendingGrace.length === 0 && (
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  All caught up!
                </div>
              )}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-text-primary">Recent Sessions</h2>
            </div>
            <div className="space-y-3">
              {recentInteractions.map((i) => {
                const mentee = mentees.find((m) => m.id === i.mentee_id);
                return (
                  <div key={i.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center text-secondary text-xs font-bold flex-shrink-0 mt-0.5">
                      {mentee?.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate">{mentee?.full_name ?? "Unknown"}</div>
                      <div className="text-xs text-text-muted">
                        {i.type} · {new Date(i.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                    {!i.is_acknowledged && (
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" title="Not yet acknowledged" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
