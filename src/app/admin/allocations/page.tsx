"use client";

import AppShell from "@/components/AppShell";
import { mockAllocations, mockProfiles, currentAdminUser } from "@/lib/mock-data";
import { UserCheck, Plus, Shuffle, X } from "lucide-react";
import { useState } from "react";

export default function AdminAllocations() {
  const user = currentAdminUser;
  const mentors = mockProfiles.filter((p) => p.role === "mentor");
  const students = mockProfiles.filter((p) => p.role === "mentee");
  
  const [allocations, setAllocations] = useState(mockAllocations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleRemove = (menteeId: string) => {
    setAllocations(allocations.filter(a => a.mentee_id !== menteeId));
  };
  
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newAlloc: any = {
      id: "alloc-" + Date.now(),
      mentor_id: fd.get("mentor_id"),
      mentee_id: fd.get("mentee_id"),
      academic_year: "2024-2025",
      is_active: true,
      created_at: new Date().toISOString()
    };
    setAllocations([...allocations, newAlloc]);
    setShowAddModal(false);
  };
  
  const handleAutoAllocate = () => {
    setIsShuffling(true);
    setTimeout(() => {
      // Dummy shuffle demo
      setIsShuffling(false);
    }, 1000);
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
          <h1 className="text-2xl font-heading font-bold text-text-primary">Mentor Allocations</h1>
          <p className="text-text-muted text-sm mt-0.5">{allocations.filter(a => a.is_active).length} active mentor‑mentee pairs</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAutoAllocate} className="btn-ghost btn-sm">
            <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
            {isShuffling ? "Allocating..." : "Auto-Allocate"}
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
            <Plus className="w-3.5 h-3.5" />
            Add Allocation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mentors.map((mentor) => {
          const menteeIds = allocations
            .filter((a) => a.mentor_id === mentor.id && a.is_active)
            .map((a) => a.mentee_id);
          const mentees = students.filter((s) => menteeIds.includes(s.id));

          return (
            <div key={mentor.id} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                  {mentor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-text-primary">{mentor.full_name}</div>
                  <div className="text-xs text-text-muted">{mentor.designation} · {mentor.department}</div>
                </div>
                <span className="badge badge-secondary">{mentees.length} mentees</span>
              </div>

              <div className="space-y-2">
                {mentees.map((mentee) => (
                  <div key={mentee.id} className="flex items-center gap-3 p-2.5 rounded-button bg-surface-border/20 hover:bg-accent/5 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                      {mentee.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary">{mentee.full_name}</div>
                      <div className="text-xs text-text-muted">{mentee.usn} · Yr {mentee.year}</div>
                    </div>
                    <button onClick={() => handleRemove(mentee.id)} className="btn-icon opacity-50 hover:opacity-100" title="Remove allocation">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {mentees.length === 0 && (
                  <p className="text-text-muted text-sm text-center py-2">No mentees assigned</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Allocation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">Manual Allocation</h2>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="label">Select Mentor</label>
                <select name="mentor_id" required className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent">
                  <option value="">-- Choose Mentor --</option>
                  {mentors.map(m => (
                    <option key={m.id} value={m.id}>{m.full_name} ({m.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Select Mentee</label>
                <select name="mentee_id" required className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent">
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.full_name} ({s.usn})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Assign Mentor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
