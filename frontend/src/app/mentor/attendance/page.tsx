"use client";

import AppShell from "@/components/AppShell";
import { mockAttendanceSummary, getMenteesForMentor, currentMentorUser } from "@/lib/mock-data";
import { UserCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function MentorAttendance() {
  const user = currentMentorUser;
  const mentees = getMenteesForMentor(user.id);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("Database Management Systems");
  const [attendance, setAttendance] = useState<Record<string, "Present" | "Absent" | "Late">>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const mark = (id: string, status: "Present" | "Absent" | "Late") => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setAttendance({}); // reset
    }, 1000);
  };

  return (
    <AppShell
      role="mentor"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Mark Attendance</h1>
        <p className="text-text-muted text-sm mt-0.5">Record attendance for your class or mentee group</p>
      </div>

      <div className="card p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input">
              <option>Database Management Systems</option>
              <option>Computer Networks</option>
              <option>Machine Learning</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-heading font-semibold text-text-primary mb-4">Students</h2>
        <div className="space-y-3">
          {mentees.map((mentee) => {
            const status = attendance[mentee.id];
            return (
              <div key={mentee.id} className="flex items-center gap-4 p-3 rounded-button border border-surface-border">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                  {mentee.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">{mentee.full_name}</div>
                  <div className="text-xs text-text-muted">{mentee.usn}</div>
                </div>
                <div className="flex gap-2">
                  {(["Present", "Late", "Absent"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => mark(mentee.id, s)}
                      className={`btn btn-sm rounded-full border text-xs ${
                        status === s
                          ? s === "Present" ? "bg-success text-white border-success" :
                            s === "Late" ? "bg-accent text-background border-accent" :
                            "bg-danger text-white border-danger"
                          : "bg-transparent text-text-muted border-surface-border hover:text-text-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {success && (
          <div className="mt-4 p-3 rounded-card bg-success/10 border border-success/20 text-success text-sm flex items-center justify-center gap-2 animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4" />
            Attendance submitted successfully!
          </div>
        )}
        <div className="flex justify-end mt-5">
          <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary transition-all">
            {isSubmitting ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {isSubmitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
