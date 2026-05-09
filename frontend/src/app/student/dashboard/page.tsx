"use client";

import { useState, useEffect } from "react";

import AppShell from "@/components/AppShell";
import {
  mockAcademicHealth,
  mockPendingActions,
  mockSchedule,
  mockAttendanceSummary,
} from "@/lib/mock-data";
import { auth, dataService } from "@/lib/data-service";
import { Achievement, Notification, FeedPost } from "@/lib/types";
import {
  TrendingUp,
  Clock,
  Trophy,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Zap,
  BookOpen,
  Bell,
  Star,
  Award,
  Calendar,
  X,
} from "lucide-react";
import Link from "next/link";

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div className="card card-interactive p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-sm">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-heading font-bold text-text-primary">{value}</div>
        {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function AttendanceBar({ subject, percentage }: { subject: string; percentage: number }) {
  const color =
    percentage >= 85 ? "#6FCF97" : percentage >= 75 ? "#E8A87C" : "#E07070";
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs text-text-muted truncate flex-shrink-0">{subject}</div>
      <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium w-10 text-right" style={{ color }}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}

const priorityStyles = {
  high: "text-danger bg-danger/10 border-danger/20",
  medium: "text-accent bg-accent/10 border-accent/20",
  low: "text-secondary bg-secondary/10 border-secondary/20",
};

const priorityDot = {
  high: "bg-danger",
  medium: "bg-accent",
  low: "bg-secondary",
};

export default function StudentDashboard() {
  const user = auth.getCurrentUser();
  const health = mockAcademicHealth;
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  
  const [showNbaModal, setShowNbaModal] = useState(false);
  const [actions, setActions] = useState(mockPendingActions);

  useEffect(() => {
    if (user) {
      dataService.getStudentAchievements(user.id).then(setAchievements);
      dataService.getNotifications(user.id).then(setNotifications);
      dataService.getFeedPosts().then(setFeed);
    }
  }, [user]);

  const unreadNotifs = notifications.filter((n) => !n.is_read);
  const verifiedAchievements = achievements.filter((a) => a.status === "Verified");
  const nbaScore = verifiedAchievements.reduce((sum, a) => sum + a.nba_points, 0);

  const pendingAchievements = achievements.filter((a) => a.status === "Pending").length;
  
  const currentClass = mockSchedule.find((s) => s.isCurrent);
  const upcomingClasses = mockSchedule.filter((s) => !s.isCurrent).slice(0, 3);

  const healthColor =
    health.healthStatus === "good"
      ? "text-success"
      : health.healthStatus === "warning"
      ? "text-accent"
      : "text-danger";

  if (!user) return <div className="p-10 text-center">Please log in first.</div>;

  return (
    <AppShell
      role="student"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Good morning, {user.full_name.split(" ")[0]} 👋
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            {user.department} · Year {user.year} · Section {user.section} · {user.usn}
          </p>
        </div>
        <Link href="/student/feed" className="relative">
          <button className="btn-ghost btn-sm">
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            )}
          </button>
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">

        {/* CGPA — large */}
        <div className="card card-interactive p-6 lg:col-span-2 lg:row-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm font-medium">Academic Health</span>
            <span className={`badge ${health.healthStatus === "good" ? "badge-success" : health.healthStatus === "warning" ? "badge-accent" : "badge-danger"}`}>
              {health.healthStatus === "good" ? "✓ On Track" : health.healthStatus === "warning" ? "⚠ Watch Out" : "Needs Help"}
            </span>
          </div>
          <div className="flex items-end gap-6 flex-wrap">
            <div>
              <div className="text-6xl font-heading font-bold text-text-primary">{health.cgpa}</div>
              <div className="text-text-muted text-sm mt-1">Current CGPA</div>
            </div>
            <div>
              <div className={`text-4xl font-heading font-bold ${health.attendance >= 75 ? "text-success" : "text-danger"}`}>
                {health.attendance}%
              </div>
              <div className="text-text-muted text-sm mt-1">Attendance</div>
            </div>
          </div>
          {/* Mini sparkline */}
          <div className="mt-2 w-full pt-4">
            <div className="text-xs font-semibold text-text-muted mb-4 uppercase tracking-wider">Semester GPA Trend</div>
            <div className="flex items-end gap-2 h-24 w-full border-b border-surface-border pb-1">
              {health.semesterGpas.map(({ semester, gpa }) => {
                const heightPct = Math.max((gpa / 10) * 100, 10);
                return (
                  <div key={semester} className="flex flex-col items-center justify-end gap-1 flex-1 h-full">
                    <div
                      className="w-full rounded-t-sm transition-all duration-500 relative group cursor-help bg-accent/80 hover:bg-accent"
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-accent/20 px-2 py-1 flex items-center justify-center text-xs font-bold text-accent rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-max shadow-md">
                        {gpa.toFixed(2)}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted mt-1">S{semester}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* NBA Score */}
        <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowNbaModal(true)}>
          <StatCard
            label="NBA Score"
            value={nbaScore}
            sub="Verified achievement points"
            color="bg-accent/10 text-accent"
            icon={Award}
          />
        </div>

        {/* Pending Actions count */}
        <a href="#action-items" className="block cursor-pointer hover:opacity-80 transition-opacity">
          <StatCard
            label="Pending Actions"
            value={actions.length}
            sub={`${pendingAchievements} achievement${pendingAchievements !== 1 ? "s" : ""} awaiting verification`}
            color="bg-highlight/10 text-highlight"
            icon={AlertCircle}
          />
        </a>

        {/* Current / Next Class */}
        <div className="card card-interactive p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Today&apos;s Schedule
            </span>
          </div>
          {currentClass && (
            <div className="rounded-button bg-accent/10 border border-accent/20 px-4 py-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="status-dot status-dot-warning animate-pulse-soft" />
                <span className="text-xs text-accent font-medium">NOW IN CLASS</span>
              </div>
              <div className="text-sm font-semibold text-text-primary">{currentClass.subject}</div>
              <div className="text-xs text-text-muted">{currentClass.room} · {currentClass.time}–{currentClass.endTime}</div>
            </div>
          )}
          <div className="space-y-2">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center gap-3 text-sm">
                <span className="text-text-muted w-10 text-xs font-mono flex-shrink-0">{cls.time}</span>
                <span className="text-text-primary truncate flex-1">{cls.subject}</span>
                <span className="text-text-muted text-xs">{cls.room}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance per subject */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm font-medium flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Subject Attendance
            </span>
            <Link href="/student/academics" className="text-xs text-accent hover:underline">Details</Link>
          </div>
          <div className="space-y-3">
            {mockAttendanceSummary.map((s) => (
              <AttendanceBar key={s.subject} subject={s.subject} percentage={s.percentage} />
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div id="action-items" className="card p-5 lg:col-span-2 scroll-mt-24">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Action Items
            </span>
          </div>
          <div className="space-y-2">
            {actions.map((action) => (
              <div 
                key={action.id} 
                onClick={() => setActions(actions.filter(a => a.id !== action.id))}
                className={`flex items-center gap-3 rounded-button px-3 py-2.5 border text-sm cursor-pointer hover:opacity-80 transition-opacity ${priorityStyles[action.priority]}`}
              >
                <span className={`status-dot flex-shrink-0 ${priorityDot[action.priority]}`} />
                <span className="flex-1 text-text-primary text-sm line-clamp-1">{action.title}</span>
                <span className="text-xs opacity-70 border border-current px-2 py-0.5 rounded-full whitespace-nowrap">Mark Done</span>
              </div>
            ))}
            {actions.length === 0 && (
              <div className="text-sm text-text-muted italic py-2 text-center border-2 border-dashed border-surface-border rounded-button">
                All caught up! Excellent work.
              </div>
            )}
          </div>
        </div>

        {/* Latest Feed */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm font-medium flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              Recent Announcements
            </span>
            <Link href="/student/feed" className="text-xs text-accent hover:underline">See all</Link>
          </div>
          <div className="space-y-3">
            {feed.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  post.type === "Placement" ? "bg-success" :
                  post.type === "Hackathon" ? "bg-accent" :
                  post.type === "Event" ? "bg-highlight" : "bg-secondary"
                }`} />
                <div className="min-w-0">
                  <div className="text-sm text-text-primary font-medium truncate">{post.title}</div>
                  <div className="text-xs text-text-muted">
                    {new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements preview */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm font-medium flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              My Achievements
            </span>
            <Link href="/student/achievements" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {achievements
              .slice(0, 3)
              .map((ach) => (
                <div key={ach.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    ach.status === "Verified" ? "bg-success" :
                    ach.status === "Pending" ? "bg-accent" : "bg-danger"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text-primary truncate">{ach.title}</div>
                    <div className="text-xs text-text-muted">{ach.category} · {ach.nba_points} pts</div>
                  </div>
                  <span className={`badge text-[10px] ${
                    ach.status === "Verified" ? "badge-success" :
                    ach.status === "Pending" ? "badge-accent" : "badge-danger"
                  }`}>{ach.status}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* NBA Breakdown Modal */}
      {showNbaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                NBA Points Breakdown
              </h2>
              <button onClick={() => setShowNbaModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 scrollbar-hide">
              {verifiedAchievements.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-4">No verified points yet.</p>
              ) : (
                verifiedAchievements.map(ach => (
                  <div key={ach.id} className="flex items-center justify-between p-3 rounded-button bg-surface border border-surface-border hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">{ach.title}</div>
                        <div className="text-xs text-text-muted">{ach.category} · {ach.level || "Regional"}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-accent">+{ach.nba_points}</div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-surface-border/30 border-t border-surface-border rounded-b-card flex justify-between items-center">
              <span className="text-sm font-medium text-text-muted">Total Score</span>
              <span className="text-2xl font-heading font-bold text-text-primary">{nbaScore}</span>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
