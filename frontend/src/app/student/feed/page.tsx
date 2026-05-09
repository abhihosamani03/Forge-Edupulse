"use client";

import AppShell from "@/components/AppShell";
import { mockFeed, mockNotifications, currentStudentUser } from "@/lib/mock-data";
import { Bell, Megaphone, Trophy, Briefcase, Calendar, Users, Zap } from "lucide-react";
import type { FeedType } from "@/lib/types";
import { useState } from "react";

const TYPE_META: Record<NonNullable<FeedType>, { icon: React.ElementType; color: string; bg: string }> = {
  Announcement: { icon: Megaphone, color: "text-secondary", bg: "bg-secondary/10" },
  Placement: { icon: Briefcase, color: "text-success", bg: "bg-success/10" },
  Event: { icon: Calendar, color: "text-highlight", bg: "bg-highlight/10" },
  Hackathon: { icon: Zap, color: "text-accent", bg: "bg-accent/10" },
  Club: { icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
  Other: { icon: Bell, color: "text-text-muted", bg: "bg-surface-border/30" },
};

export default function StudentFeed() {
  const user = currentStudentUser;
  const [notifs, setNotifs] = useState(mockNotifications.filter((n) => n.user_id === user.id));
  const [activeTab, setActiveTab] = useState<"feed" | "notifications">("feed");

  const markAsRead = (id: string) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <AppShell
      role="student"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Feed &amp; Notifications</h1>
        <p className="text-text-muted text-sm mt-0.5">Campus announcements, events &amp; alerts</p>
      </div>

      <div className="flex gap-1 p-1 bg-surface rounded-button mb-6 w-fit">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex items-center gap-2 px-5 py-2 rounded-button text-sm font-medium transition-all ${
            activeTab === "feed" ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          Campus Feed
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-5 py-2 rounded-button text-sm font-medium transition-all relative ${
            activeTab === "notifications" ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          Notifications
          {notifs.filter((n) => !n.is_read).length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
              {notifs.filter((n) => !n.is_read).length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "feed" && (
        <div className="space-y-4">
          {mockFeed.map((post) => {
            const type = post.type ?? "Other";
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            return (
              <div key={post.id} className="card card-interactive p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                    <Icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-heading font-bold text-text-primary">{post.title}</h3>
                      <span className={`badge text-xs border ${meta.bg} ${meta.color} border-current/20`}>{type}</span>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed">{post.content}</p>
                    <div className="mt-3 text-xs text-text-muted">
                      {new Date(post.created_at).toLocaleDateString("en-IN", {
                        weekday: "short", day: "numeric", month: "long", year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-3">
          {notifs.map((notif) => (
            <div
              key={notif.id}
              className={`card p-4 flex items-start gap-4 transition-all duration-200 ${
                !notif.is_read ? "border-accent/20" : ""
              }`}
            >
              {!notif.is_read && (
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
              )}
              <div className={`flex-1 min-w-0 ${notif.is_read ? "ml-6" : ""}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-text-primary">{notif.title}</span>
                  {notif.category && (
                    <span className={`badge text-[10px] ${
                      notif.category === "Academic" ? "badge-accent" :
                      notif.category === "Achievement" ? "badge-success" :
                      notif.category === "Mentorship" ? "badge-secondary" : "badge-highlight"
                    }`}>{notif.category}</span>
                  )}
                </div>
                {notif.message && (
                  <p className="text-text-muted text-sm mt-0.5">{notif.message}</p>
                )}
                <div className="text-xs text-text-muted mt-1">
                  {new Date(notif.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
              </div>
              {!notif.is_read && (
                <button onClick={() => markAsRead(notif.id)} className="btn-ghost btn-sm text-xs flex-shrink-0">Mark read</button>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
