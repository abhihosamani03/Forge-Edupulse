"use client";

import AppShell from "@/components/AppShell";
import {
  mockAchievements,
  getMenteesForMentor,
  currentMentorUser,
} from "@/lib/mock-data";
import { Trophy, CheckCircle2, XCircle, Clock, Star, Filter } from "lucide-react";
import { useState } from "react";

export default function MentorAchievements() {
  const user = currentMentorUser;
  const mentees = getMenteesForMentor(user.id);
  const menteeIds = mentees.map((m) => m.id);

  const [allAchs, setAllAchs] = useState(mockAchievements.filter((a) => menteeIds.includes(a.student_id)));
  const [filter, setFilter] = useState<"all" | "Pending" | "Verified" | "Rejected">("Pending");

  const filtered = filter === "all" ? allAchs : allAchs.filter((a) => a.status === filter);

  const handleVerify = (id: string, points: number) => {
    const updated = allAchs.map(a => a.id === id ? { ...a, status: "Verified", nba_points: points } as any : a);
    setAllAchs(updated);
    const globalIdx = mockAchievements.findIndex(m => m.id === id);
    if (globalIdx !== -1) mockAchievements[globalIdx] = { ...mockAchievements[globalIdx], status: "Verified", nba_points: points } as any;
  };

  const handleReject = (id: string) => {
    const updated = allAchs.map(a => a.id === id ? { ...a, status: "Rejected", rejection_reason: "Does not meet criteria" } as any : a);
    setAllAchs(updated);
    const globalIdx = mockAchievements.findIndex(m => m.id === id);
    if (globalIdx !== -1) mockAchievements[globalIdx] = { ...mockAchievements[globalIdx], status: "Rejected", rejection_reason: "Does not meet criteria" } as any;
  };

  return (
    <AppShell
      role="mentor"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Achievement Verification</h1>
        <p className="text-text-muted text-sm mt-0.5">Review and verify your mentees&apos; achievements</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending", count: allAchs.filter(a => a.status === "Pending").length, color: "text-accent", bg: "bg-accent/10" },
          { label: "Verified", count: allAchs.filter(a => a.status === "Verified").length, color: "text-success", bg: "bg-success/10" },
          { label: "Rejected", count: allAchs.filter(a => a.status === "Rejected").length, color: "text-danger", bg: "bg-danger/10" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`card p-5 text-center cursor-pointer hover:border-accent/20 transition-colors`}
            onClick={() => setFilter(label as "Pending" | "Verified" | "Rejected")}>
            <div className={`text-3xl font-heading font-bold ${color}`}>{count}</div>
            <div className="text-text-muted text-sm mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(["all", "Pending", "Verified", "Rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm rounded-full border ${
              filter === f ? "bg-accent text-background border-accent" : "bg-transparent text-text-muted border-surface-border hover:text-text-primary"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((ach) => {
          const mentee = mentees.find((m) => m.id === ach.student_id);
          return (
            <div key={ach.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="badge badge-accent">{ach.category}</span>
                    {ach.level && <span className="text-xs text-highlight font-semibold">{ach.level}</span>}
                  </div>
                  <h3 className="font-heading font-bold text-text-primary">{ach.title}</h3>
                  <div className="text-xs text-text-muted mt-0.5">{mentee?.full_name} · {mentee?.usn}</div>
                  {ach.issuing_body && <p className="text-sm text-text-muted mt-1">{ach.issuing_body}</p>}
                  {ach.description && <p className="text-xs text-text-muted mt-1 line-clamp-2">{ach.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    {ach.date && <span>{new Date(ach.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>}
                    <span className="flex items-center gap-1 text-accent font-semibold"><Star className="w-3 h-3" />{ach.nba_points} pts</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {ach.status === "Pending" ? (
                    <>
                      <button onClick={() => handleVerify(ach.id, 10)} className="btn-primary btn-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verify
                      </button>
                      <button onClick={() => handleReject(ach.id)} className="btn-danger btn-sm">
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`badge ${ach.status === "Verified" ? "badge-success" : "badge-danger"}`}>
                      {ach.status === "Verified" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {ach.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Trophy className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-30" />
            <p className="text-text-muted">No achievements in this category.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
