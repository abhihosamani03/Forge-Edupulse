"use client";

import AppShell from "@/components/AppShell";
import { currentMentorUser } from "@/lib/mock-data";
import {
  Users,
  Plus,
  Clock,
  AlertCircle,
  Loader2,
  Mail,
  Hash,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function LogSessionModal({
  mentee,
  onClose,
}: {
  mentee: Profile;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card p-6 w-full max-w-lg animate-fade-in-up">
        <h2 className="font-heading font-bold text-lg text-text-primary mb-4">
          Log Session — {mentee.full_name}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
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
            <input
              type="text"
              className="input"
              placeholder="e.g. Resume review, DBMS concepts..."
            />
          </div>
          <div>
            <label className="label">Remarks</label>
            <textarea
              rows={3}
              className="input resize-none"
              placeholder="Mentor observations and notes..."
            />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="followup" className="rounded" />
            <label htmlFor="followup" className="text-sm text-text-primary">
              Follow-up required
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="btn-primary flex-1">Log Session</button>
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MentorMentees() {
  const user = currentMentorUser;
  const [mentees, setMentees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState<Profile | null>(null);
  const [loggingFor, setLoggingFor] = useState<Profile | null>(null);

  const fetchMentees = useCallback(async () => {
    setLoading(true);
    try {
      // Get allocation records for this mentor
      const { data: allocations, error: allocError } = await supabase
        .from("allocations")
        .select("mentee_id")
        .eq("mentor_id", user.id)
        .eq("is_active", true);

      if (allocError) throw allocError;

      if (!allocations || allocations.length === 0) {
        setMentees([]);
        setLoading(false);
        return;
      }

      const menteeIds = allocations.map((a) => a.mentee_id);

      // Fetch the mentee profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", menteeIds);

      if (profileError) throw profileError;
      setMentees((profiles as Profile[]) || []);
    } catch (err) {
      console.error("Failed to fetch mentees:", err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchMentees();
  }, [fetchMentees]);

  return (
    <AppShell
      role="mentor"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)}
    >
      {loggingFor && (
        <LogSessionModal
          mentee={loggingFor}
          onClose={() => setLoggingFor(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          My Mentees
        </h1>
        <p className="text-text-muted text-sm mt-0.5">
          {loading
            ? "Loading..."
            : `${mentees.length} active mentee${mentees.length !== 1 ? "s" : ""} assigned`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : mentees.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-heading font-bold text-text-primary mb-2">
            No Mentees Assigned Yet
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            Students will appear here once the Admin assigns them to you via the
            Allocations panel, or after you upload attendance and choose to
            mentor those students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mentee list */}
          <div className="space-y-3">
            {mentees.map((mentee) => {
              const isSelected = selectedMentee?.id === mentee.id;
              return (
                <div
                  key={mentee.id}
                  onClick={() =>
                    setSelectedMentee(isSelected ? null : mentee)
                  }
                  className={`card card-interactive cursor-pointer p-4 transition-all duration-200 ${
                    isSelected ? "border-accent/40 glow-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold flex-shrink-0">
                      {mentee.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-text-primary truncate block">
                        {mentee.full_name}
                      </span>
                      <div className="text-xs text-text-muted">
                        {mentee.usn || mentee.email}
                        {mentee.year ? ` · Yr ${mentee.year}` : ""}
                        {mentee.section ? mentee.section : ""}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                        {selectedMentee.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-lg text-text-primary">
                          {selectedMentee.full_name}
                        </h2>
                        <div className="text-text-muted text-sm">
                          {selectedMentee.department}
                        </div>
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
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedMentee.usn && (
                    <div className="card p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-text-muted">USN</span>
                      </div>
                      <div className="text-sm font-semibold text-text-primary">
                        {selectedMentee.usn}
                      </div>
                    </div>
                  )}
                  {selectedMentee.email && (
                    <div className="card p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-text-muted">Email</span>
                      </div>
                      <div className="text-sm font-semibold text-text-primary truncate">
                        {selectedMentee.email}
                      </div>
                    </div>
                  )}
                  {selectedMentee.year && (
                    <div className="card p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-text-muted">
                          Year / Section
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-text-primary">
                        Year {selectedMentee.year}
                        {selectedMentee.section
                          ? ` — ${selectedMentee.section}`
                          : ""}
                      </div>
                    </div>
                  )}
                </div>

                {/* Interaction history placeholder */}
                <div className="card p-5">
                  <h3 className="font-semibold text-sm text-text-primary mb-4">
                    Interaction History
                  </h3>
                  <p className="text-text-muted text-sm text-center py-4">
                    No sessions logged yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Users className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
                <p className="text-text-muted">
                  Select a mentee to view their profile & interactions
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
