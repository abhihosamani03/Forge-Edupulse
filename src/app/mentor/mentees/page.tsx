"use client";

import AppShell from "@/components/AppShell";
import {
  getMenteesForMentor,
  mockInteractions,
  mockGraceRequests,
  mockAchievements,
  mockGrades,
  currentMentorUser,
  calculateNbaScore,
} from "@/lib/mock-data";
import {
  Users,
  Star,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Plus,
  Clock,
  Trophy,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import type { Profile } from "@/lib/types";

function LogSessionModal({ mentee, onClose }: { mentee: Profile; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card p-6 w-full max-w-lg animate-fade-in-up">
        <h2 className="font-heading font-bold text-lg text-text-primary mb-4">
          Log Session — {mentee.full_name}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" defaultValue={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select className="input">
                <option>Academic</option>
                <option>Career</option>
                <option>Personal</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label className="label">Mode</label>
              <select className="input">
                <option>In-Person</option>
                <option>Online</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Duration (minutes)</label>
            <input type="number" className="input" placeholder="30" />
          </div>
          <div>
            <label className="label">Topics Discussed</label>
            <input type="text" className="input" placeholder="e.g. Resume review, DBMS concepts..." />
          </div>
          <div>
            <label className="label">Remarks</label>
            <textarea rows={3} className="input resize-none" placeholder="Mentor observations and notes..." />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="followup" className="rounded" />
            <label htmlFor="followup" className="text-sm text-text-primary">Follow-up required</label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="btn-primary flex-1">Log Session</button>
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function MentorMentees() {
  const user = currentMentorUser;
  const mentees = getMenteesForMentor(user.id);
  const [selectedMentee, setSelectedMentee] = useState<Profile | null>(null);
  const [loggingFor, setLoggingFor] = useState<Profile | null>(null);

  const getMenteeInteractions = (menteeId: string) =>
    mockInteractions
      .filter((i) => i.mentor_id === user.id && i.mentee_id === menteeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getMenteeGrade = (menteeId: string) => {
    const grades = mockGrades.filter((g) => g.student_id === menteeId);
    return grades.length ? grades[grades.length - 1] : null;
  };

  return (
    <AppShell
      role="mentor"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      {loggingFor && <LogSessionModal mentee={loggingFor} onClose={() => setLoggingFor(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">My Mentees</h1>
        <p className="text-text-muted text-sm mt-0.5">{mentees.length} active mentees assigned</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentee list */}
        <div className="space-y-6">
          {Array.from(new Set(mentees.map(m => `Year ${m.year} — Section ${m.section}`))).sort().map(groupKey => (
            <div key={groupKey} className="space-y-3">
              <h3 className="font-heading font-semibold text-text-primary text-sm sticky top-0 bg-background/90 backdrop-blur-sm py-2 z-10 border-b border-surface-border">
                {groupKey}
              </h3>
              {mentees.filter(m => `Year ${m.year} — Section ${m.section}` === groupKey).map((mentee) => {
                const nba = calculateNbaScore(mentee.id);
                const interactions = getMenteeInteractions(mentee.id);
                const isSelected = selectedMentee?.id === mentee.id;
                return (
                  <div
                    key={mentee.id}
                onClick={() => setSelectedMentee(isSelected ? null : mentee)}
                className={`card card-interactive cursor-pointer p-4 transition-all duration-200 ${
                  isSelected ? "border-accent/40 glow-accent" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold flex-shrink-0">
                    {mentee.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary truncate">{mentee.full_name}</span>
                      {!mentee.is_profile_complete && (
                        <AlertCircle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-text-muted">{mentee.usn} · Yr {mentee.year}{mentee.section}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-accent">{nba} pts</div>
                    <div className="text-xs text-text-muted">{interactions.length} sessions</div>
                  </div>
                </div>
              </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Mentee details */}
        <div className="lg:col-span-2">
          {selectedMentee ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="card p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xl font-bold">
                      {selectedMentee.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-lg text-text-primary">{selectedMentee.full_name}</h2>
                      <div className="text-text-muted text-sm">{selectedMentee.usn} · {selectedMentee.department}</div>
                      <div className="text-text-muted text-xs">Year {selectedMentee.year} · Section {selectedMentee.section}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setLoggingFor(selectedMentee)}
                    className="btn-primary btn-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Log Session
                  </button>
                </div>

                {/* Quick links */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {selectedMentee.linkedin_url && (
                    <a href={selectedMentee.linkedin_url} target="_blank" rel="noreferrer" className="btn-ghost btn-sm text-xs">LinkedIn</a>
                  )}
                  {selectedMentee.github_url && (
                    <a href={selectedMentee.github_url} target="_blank" rel="noreferrer" className="btn-ghost btn-sm text-xs">GitHub</a>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="card p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-accent">{calculateNbaScore(selectedMentee.id)}</div>
                  <div className="text-xs text-text-muted">NBA Points</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-text-primary">
                    {getMenteeInteractions(selectedMentee.id).length}
                  </div>
                  <div className="text-xs text-text-muted">Sessions</div>
                </div>
                <div className="card p-4 text-center">
                  <div className={`text-2xl font-heading font-bold ${selectedMentee.is_profile_complete ? "text-success" : "text-danger"}`}>
                    {selectedMentee.is_profile_complete ? "✓" : "✗"}
                  </div>
                  <div className="text-xs text-text-muted">Profile</div>
                </div>
              </div>

              {/* Recent Interactions */}
              <div className="card p-5">
                <h3 className="font-semibold text-sm text-text-primary mb-4">Interaction History</h3>
                <div className="space-y-3">
                  {getMenteeInteractions(selectedMentee.id).map((i) => (
                    <div key={i.id} className="border border-surface-border rounded-button p-3">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`badge text-xs ${
                            i.type === "Academic" ? "badge-accent" :
                            i.type === "Career" ? "badge-secondary" : "badge-highlight"
                          }`}>{i.type}</span>
                          <span className="text-xs text-text-muted">{i.mode}</span>
                        </div>
                        <span className="text-xs text-text-muted">
                          {new Date(i.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {i.topics && <p className="text-sm text-text-primary">{i.topics}</p>}
                      {i.remarks && <p className="text-xs text-text-muted mt-1 italic">"{i.remarks}"</p>}
                      {!i.is_acknowledged && (
                        <div className="mt-2 text-xs text-accent flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Awaiting student acknowledgement
                        </div>
                      )}
                    </div>
                  ))}
                  {getMenteeInteractions(selectedMentee.id).length === 0 && (
                    <p className="text-text-muted text-sm text-center py-4">No sessions logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Users className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-text-muted">Select a mentee to view their profile &amp; interactions</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
