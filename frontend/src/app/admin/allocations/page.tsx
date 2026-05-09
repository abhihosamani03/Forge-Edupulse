"use client";

import AppShell from "@/components/AppShell";
import { currentAdminUser } from "@/lib/mock-data";
import {
  UserCheck,
  Plus,
  X,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Profile {
  id: string;
  role: string;
  full_name: string;
  email: string;
  department?: string;
  usn?: string;
  designation?: string;
}

interface Allocation {
  id: string;
  mentor_id: string;
  mentee_id: string;
  is_active: boolean;
  allocated_at: string;
}

export default function AdminAllocations() {
  const user = currentAdminUser;

  const [mentors, setMentors] = useState<Profile[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Bulk assign state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [assigning, setAssigning] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Single assign state
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesRes, allocRes] = await Promise.all([
        supabase.from("profiles").select("id, role, full_name, email, department, usn, designation"),
        supabase.from("allocations").select("*").eq("is_active", true),
      ]);

      if (profilesRes.data) {
        setMentors(profilesRes.data.filter((p) => p.role === "mentor"));
        setStudents(profilesRes.data.filter((p) => p.role === "mentee"));
      }
      if (allocRes.data) setAllocations(allocRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get unallocated students (not assigned to any mentor)
  const allocatedMenteeIds = new Set(allocations.map((a) => a.mentee_id));
  const unallocatedStudents = students.filter((s) => !allocatedMenteeIds.has(s.id));

  // Remove single allocation
  const handleRemove = async (allocationId: string) => {
    const { error } = await supabase
      .from("allocations")
      .update({ is_active: false })
      .eq("id", allocationId);

    if (error) {
      setStatusMsg({ type: "error", text: "Failed to remove allocation." });
    } else {
      setAllocations((prev) => prev.filter((a) => a.id !== allocationId));
      setStatusMsg({ type: "success", text: "Allocation removed." });
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Single assign
  const handleSingleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const mentorId = fd.get("mentor_id") as string;
    const menteeId = fd.get("mentee_id") as string;

    const { data, error } = await supabase
      .from("allocations")
      .upsert(
        { mentor_id: mentorId, mentee_id: menteeId, is_active: true },
        { onConflict: "mentor_id,mentee_id" }
      )
      .select()
      .single();

    if (error) {
      setStatusMsg({ type: "error", text: error.message });
    } else if (data) {
      setAllocations((prev) => [...prev.filter((a) => a.mentee_id !== menteeId), data]);
      setShowAddModal(false);
      setStatusMsg({ type: "success", text: "Student assigned successfully." });
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Bulk assign
  const handleBulkAssign = async () => {
    if (!selectedMentor || selectedStudents.size === 0) return;
    setAssigning(true);

    const records = Array.from(selectedStudents).map((menteeId) => ({
      mentor_id: selectedMentor,
      mentee_id: menteeId,
      is_active: true,
    }));

    const { data, error } = await supabase
      .from("allocations")
      .upsert(records, { onConflict: "mentor_id,mentee_id" })
      .select();

    if (error) {
      setStatusMsg({ type: "error", text: error.message });
    } else {
      await fetchData();
      setShowBulkModal(false);
      setSelectedMentor("");
      setSelectedStudents(new Set());
      setStatusMsg({
        type: "success",
        text: `${records.length} student(s) assigned successfully.`,
      });
    }
    setAssigning(false);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Toggle student selection
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedStudents.size === unallocatedStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(unallocatedStudents.map((s) => s.id)));
    }
  };

  if (loading) {
    return (
      <AppShell
        role="admin"
        userName={user.full_name}
        userEmail={user.email}
        userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      role="admin"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Mentor Allocations
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            {allocations.length} active pairs · {unallocatedStudents.length} unassigned student(s)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="btn-primary btn-sm"
            id="bulk-assign-btn"
          >
            <Users className="w-3.5 h-3.5" />
            Bulk Assign
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-ghost btn-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Single Assign
          </button>
        </div>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div
          className={`flex items-center gap-2 mb-4 p-3 rounded-input text-sm ${
            statusMsg.type === "success"
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-danger/10 border border-danger/20 text-danger"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {statusMsg.text}
        </div>
      )}

      {/* Mentor cards with their mentees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mentors.map((mentor) => {
          const mentorAllocs = allocations.filter((a) => a.mentor_id === mentor.id);
          const mentees = mentorAllocs
            .map((a) => ({
              alloc: a,
              student: students.find((s) => s.id === a.mentee_id),
            }))
            .filter((x) => x.student);

          return (
            <div key={mentor.id} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                  {mentor.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-text-primary">
                    {mentor.full_name}
                  </div>
                  <div className="text-xs text-text-muted">
                    {mentor.designation || "Faculty"} · {mentor.department}
                  </div>
                </div>
                <span className="badge badge-secondary">
                  {mentees.length} mentee{mentees.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {mentees.map(({ alloc, student }) => (
                  <div
                    key={student!.id}
                    className="flex items-center gap-3 p-2.5 rounded-button bg-surface-border/20 hover:bg-accent/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                      {student!.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate">
                        {student!.full_name}
                      </div>
                      <div className="text-xs text-text-muted">
                        {student!.usn || student!.email}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(alloc.id)}
                      className="btn-icon opacity-40 hover:opacity-100"
                      title="Remove allocation"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-danger" />
                    </button>
                  </div>
                ))}
                {mentees.length === 0 && (
                  <p className="text-text-muted text-sm text-center py-3">
                    No mentees assigned
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Single Assign Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">
                Single Allocation
              </h2>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSingleAssign} className="p-5 space-y-4">
              <div>
                <label className="label">Select Mentor</label>
                <select
                  name="mentor_id"
                  required
                  className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent w-full"
                >
                  <option value="">-- Choose Mentor --</option>
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Select Student</label>
                <select
                  name="mentee_id"
                  required
                  className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent w-full"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.usn || s.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bulk Assign Modal ── */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl shadow-2xl animate-fade-in-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-surface-border flex-shrink-0">
              <div>
                <h2 className="font-heading font-bold text-text-primary">
                  Bulk Assign Students to Mentor
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Select a mentor, then choose which students to assign
                </p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="btn-icon"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Mentor selection */}
              <div>
                <label className="label">Assign to Mentor</label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent w-full"
                >
                  <option value="">-- Choose Mentor --</option>
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student selection list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">
                    Select Students ({selectedStudents.size} selected)
                  </label>
                  <button
                    onClick={selectAll}
                    className="text-xs text-accent hover:underline"
                  >
                    {selectedStudents.size === unallocatedStudents.length
                      ? "Deselect All"
                      : "Select All Unassigned"}
                  </button>
                </div>

                {unallocatedStudents.length === 0 ? (
                  <div className="text-center py-6 text-text-muted text-sm">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    All students are already assigned to a mentor.
                  </div>
                ) : (
                  <div className="space-y-1 max-h-64 overflow-y-auto border border-surface-border rounded-input p-2">
                    {unallocatedStudents.map((s) => (
                      <label
                        key={s.id}
                        className={`flex items-center gap-3 p-2 rounded-button cursor-pointer transition-colors ${
                          selectedStudents.has(s.id)
                            ? "bg-accent/10 border border-accent/20"
                            : "hover:bg-surface-border/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(s.id)}
                          onChange={() => toggleStudent(s.id)}
                          className="rounded accent-[var(--accent)]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-text-primary truncate">
                            {s.full_name}
                          </div>
                          <div className="text-xs text-text-muted">
                            {s.usn || s.email}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Also show already-assigned students */}
                {students.filter((s) => allocatedMenteeIds.has(s.id)).length >
                  0 && (
                  <details className="mt-3">
                    <summary className="text-xs text-text-muted cursor-pointer hover:text-accent">
                      Show already-assigned students (
                      {students.filter((s) => allocatedMenteeIds.has(s.id)).length}
                      )
                    </summary>
                    <div className="space-y-1 max-h-40 overflow-y-auto mt-2">
                      {students
                        .filter((s) => allocatedMenteeIds.has(s.id))
                        .map((s) => {
                          const alloc = allocations.find(
                            (a) => a.mentee_id === s.id
                          );
                          const currentMentor = mentors.find(
                            (m) => m.id === alloc?.mentor_id
                          );
                          return (
                            <label
                              key={s.id}
                              className="flex items-center gap-3 p-2 rounded-button cursor-pointer hover:bg-surface-border/30"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStudents.has(s.id)}
                                onChange={() => toggleStudent(s.id)}
                                className="rounded accent-[var(--accent)]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-text-primary truncate">
                                  {s.full_name}
                                </div>
                                <div className="text-xs text-text-muted">
                                  {s.usn || s.email} · Currently with{" "}
                                  <span className="text-secondary">
                                    {currentMentor?.full_name || "—"}
                                  </span>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                    </div>
                  </details>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center gap-3 p-5 border-t border-surface-border flex-shrink-0">
              <div className="text-xs text-text-muted">
                {selectedStudents.size} student(s) →{" "}
                {mentors.find((m) => m.id === selectedMentor)?.full_name ||
                  "No mentor selected"}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssign}
                  disabled={
                    !selectedMentor || selectedStudents.size === 0 || assigning
                  }
                  className="btn-primary"
                >
                  {assigning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Assigning…
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" /> Assign{" "}
                      {selectedStudents.size} Student(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
