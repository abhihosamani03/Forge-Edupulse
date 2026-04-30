"use client";

import AppShell from "@/components/AppShell";
import {
  mockAchievements,
  currentStudentUser,
  calculateNbaScore,
} from "@/lib/mock-data";
import { Trophy, Plus, Star, Award, CheckCircle2, Clock, XCircle, Upload, X } from "lucide-react";
import { useState } from "react";
import type { AchievementCategory } from "@/lib/types";

const CATEGORY_COLORS: Record<AchievementCategory, string> = {
  Hackathon: "badge-accent",
  Internship: "badge-secondary",
  Certification: "badge-highlight",
  "Paper Publication": "badge-success",
  Patent: "badge-success",
  Workshop: "badge-secondary",
  Conference: "badge-accent",
  Sports: "badge-danger",
  "NSS/NCC": "badge-secondary",
  Other: "badge-accent",
};

const LEVEL_COLORS = {
  International: "text-highlight",
  National: "text-accent",
  State: "text-secondary",
  College: "text-text-muted",
};

export default function StudentAchievements() {
  const user = currentStudentUser;
  const [achievementsList, setAchievementsList] = useState(mockAchievements.filter((a) => a.student_id === user.id));
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Calculate dynamically from local state
  const nbaScore = achievementsList.filter(a => a.status === 'Verified').reduce((sum, a) => sum + (a.nba_points || 0), 0);
  const [filter, setFilter] = useState<"all" | "Verified" | "Pending" | "Rejected">("all");

  const filtered = filter === "all" ? achievementsList : achievementsList.filter((a) => a.status === filter);
  const verified = achievementsList.filter((a) => a.status === "Verified");
  const pending = achievementsList.filter((a) => a.status === "Pending");

  const handleAddAchievement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newAch: any = {
      id: "ach-" + Date.now(),
      student_id: user.id,
      title: fd.get("title"),
      category: fd.get("category"),
      level: fd.get("level"),
      date: fd.get("date"),
      description: fd.get("description"),
      issuing_body: fd.get("issuing_body"),
      nba_points: 0, // Pending verification grants 0 until verified
      status: "Pending",
      file_url: "dummy-url",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockAchievements.unshift(newAch);
    setAchievementsList([newAch, ...achievementsList]);
    setShowAddModal(false);
  };

  return (
    <AppShell
      role="student"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Achievements</h1>
          <p className="text-text-muted text-sm mt-0.5">Your verified accomplishments &amp; NBA points</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-accent" />
          </div>
          <div className="text-3xl font-heading font-bold text-accent">{nbaScore}</div>
          <div className="text-text-muted text-sm mt-0.5">Total NBA Points</div>
        </div>
        <div className="card p-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div className="text-3xl font-heading font-bold text-success">{verified.length}</div>
          <div className="text-text-muted text-sm mt-0.5">Verified</div>
        </div>
        <div className="card p-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-accent" />
          </div>
          <div className="text-3xl font-heading font-bold text-accent">{pending.length}</div>
          <div className="text-text-muted text-sm mt-0.5">Pending Verification</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["all", "Verified", "Pending", "Rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm rounded-full border ${
              filter === f
                ? "bg-accent text-background border-accent"
                : "bg-transparent text-text-muted border-surface-border hover:text-text-primary"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((ach) => (
          <div key={ach.id} className="card card-interactive p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`badge ${CATEGORY_COLORS[ach.category]}`}>{ach.category}</span>
                  {ach.level && (
                    <span className={`text-xs font-semibold ${LEVEL_COLORS[ach.level]}`}>
                      {ach.level}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-text-primary leading-snug">{ach.title}</h3>
                {ach.issuing_body && (
                  <p className="text-text-muted text-sm mt-0.5">{ach.issuing_body}</p>
                )}
                {ach.description && (
                  <p className="text-text-muted text-xs mt-2 line-clamp-2">{ach.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                  {ach.date && <span>{new Date(ach.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>}
                  <span className="flex items-center gap-1 text-accent font-semibold">
                    <Star className="w-3 h-3" />
                    {ach.nba_points} pts
                  </span>
                </div>
                {ach.status === "Rejected" && ach.rejection_reason && (
                  <div className="mt-2 text-xs text-danger bg-danger/10 rounded-input px-3 py-1.5">
                    Rejected: {ach.rejection_reason}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`badge ${
                  ach.status === "Verified" ? "badge-success" :
                  ach.status === "Pending" ? "badge-accent" : "badge-danger"
                }`}>
                  {ach.status === "Verified" ? <CheckCircle2 className="w-3 h-3" /> :
                   ach.status === "Pending" ? <Clock className="w-3 h-3" /> :
                   <XCircle className="w-3 h-3" />}
                  {ach.status}
                </span>
                {ach.file_url && (
                  <button onClick={() => alert("Document viewer is simulated locally for: " + ach.title)} className="btn-ghost btn-sm text-xs">
                    <Upload className="w-3 h-3" />
                    View doc
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 card p-12 text-center">
            <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
            <p className="text-text-muted">No achievements in this category yet.</p>
          </div>
        )}
      </div>

      {/* Add Achievement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">Add New Achievement</h2>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAchievement} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Title</label>
                  <input type="text" name="title" required className="input h-[42px] px-3" placeholder="e.g. Winner at HackFest 2024" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select name="category" required className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent">
                    {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Level</label>
                  <select name="level" className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent">
                    {Object.keys(LEVEL_COLORS).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Issuing Body (Optional)</label>
                  <input type="text" name="issuing_body" className="input h-[42px] px-3" placeholder="e.g. IEEE Student Branch" />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input type="date" name="date" required className="input h-[42px] px-3 text-sm" style={{ colorScheme: 'dark' }} />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description (Optional)</label>
                  <textarea name="description" rows={3} className="input py-2" placeholder="Briefly describe your role or the achievement..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="label">Proof of Document (Certificate/Letter)</label>
                  <input type="file" required className="input text-xs py-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-colors" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-text-muted mt-1">Upload a valid document to receive NBA points upon verification.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-border flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Submit for Verification</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
