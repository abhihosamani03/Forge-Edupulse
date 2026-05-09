"use client";

import AppShell from "@/components/AppShell";
import {
  mockAttendanceSummary,
  mockGrades,
  mockAssignments,
  mockSubmissions,
  mockGraceRequests,
  currentStudentUser,
} from "@/lib/mock-data";
import { BookOpen, CheckCircle2, Clock, AlertTriangle, FileText, Plus, Upload, X } from "lucide-react";
import { useState } from "react";

type Tab = "attendance" | "grades" | "assignments" | "grace";

export default function StudentAcademics() {
  const user = currentStudentUser;
  const [activeTab, setActiveTab] = useState<Tab>("attendance");
  const [showGraceModal, setShowGraceModal] = useState(false);

  const myGrades = mockGrades.filter((g) => g.student_id === user.id);
  const mySubs = mockSubmissions.filter((s) => s.student_id === user.id);
  const [graceList, setGraceList] = useState(mockGraceRequests.filter((r) => r.student_id === user.id));

  const handleCreateGrace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newReq: any = {
      id: "grace-new-" + Date.now(),
      student_id: user.id,
      reason: fd.get("reason"),
      reason_type: fd.get("type"),
      status: "Pending",
      subject_name: fd.get("subject"),
      date_from: fd.get("dateFrom"),
      date_to: fd.get("dateTo"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGraceList([newReq, ...graceList]);
    setShowGraceModal(false);
  };

  // Group grades by semester
  const gradeBySemester = myGrades.reduce<Record<number, typeof myGrades>>((acc, g) => {
    if (!acc[g.semester]) acc[g.semester] = [];
    acc[g.semester].push(g);
    return acc;
  }, {});

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "attendance", label: "Attendance", icon: CheckCircle2 },
    { key: "grades", label: "Grades", icon: BookOpen },
    { key: "assignments", label: "Assignments", icon: FileText },
    { key: "grace", label: "Grace Requests", icon: AlertTriangle },
  ];

  return (
    <AppShell
      role="student"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Academics</h1>
        <p className="text-text-muted text-sm mt-0.5">Attendance, grades, assignments &amp; grace requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface rounded-button mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === key
                ? "bg-accent text-background shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5">
              <div className="text-text-muted text-sm mb-1">Overall Attendance</div>
              <div className="text-4xl font-heading font-bold text-success">82%</div>
              <div className="text-xs text-text-muted mt-1">Above 75% threshold ✓</div>
            </div>
            <div className="card p-5">
              <div className="text-text-muted text-sm mb-1">Classes Present</div>
              <div className="text-4xl font-heading font-bold text-text-primary">156</div>
              <div className="text-xs text-text-muted mt-1">out of 191 total</div>
            </div>
            <div className="card p-5">
              <div className="text-text-muted text-sm mb-1">At-risk Subjects</div>
              <div className="text-4xl font-heading font-bold text-accent">0</div>
              <div className="text-xs text-text-muted mt-1">All above 75%</div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Subject-wise Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Classes Held</th>
                    <th>Present</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendanceSummary.map((s) => (
                    <tr key={s.code}>
                      <td className="font-medium">{s.subject}</td>
                      <td className="font-mono text-text-muted text-xs">{s.code}</td>
                      <td>{s.total}</td>
                      <td>{s.present}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-surface-border overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${s.percentage}%`,
                                background: s.percentage >= 85 ? "#6FCF97" : s.percentage >= 75 ? "#E8A87C" : "#E07070",
                              }}
                            />
                          </div>
                          <span style={{ color: s.percentage >= 85 ? "#6FCF97" : s.percentage >= 75 ? "#E8A87C" : "#E07070" }}>
                            {s.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${s.percentage >= 85 ? "badge-success" : s.percentage >= 75 ? "badge-accent" : "badge-danger"}`}>
                          {s.percentage >= 85 ? "Good" : s.percentage >= 75 ? "OK" : "At Risk"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Grades Tab */}
      {activeTab === "grades" && (
        <div className="space-y-6">
          {Object.entries(gradeBySemester)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([sem, grades]) => {
              const sgpa = grades[0]?.sgpa;
              const cgpa = grades[0]?.cgpa;
              return (
                <div key={sem} className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-text-primary">Semester {sem}</h2>
                    <div className="flex gap-3">
                      {sgpa && <span className="badge badge-accent">SGPA: {sgpa}</span>}
                      {cgpa && <span className="badge badge-secondary">CGPA: {cgpa}</span>}
                    </div>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Code</th>
                        <th>Internal</th>
                        <th>External</th>
                        <th>Total</th>
                        <th>Grade</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g) => (
                        <tr key={g.id}>
                          <td className="font-medium">{g.subject_name}</td>
                          <td className="font-mono text-xs text-text-muted">{g.subject_code}</td>
                          <td>{g.internal_marks ?? "–"}</td>
                          <td>{g.external_marks ?? "–"}</td>
                          <td className="font-semibold">{g.total_marks ?? "–"}</td>
                          <td>
                            <span className={`badge ${
                              g.grade_letter === "S" ? "badge-success" :
                              g.grade_letter === "A" ? "badge-accent" :
                              g.grade_letter?.startsWith("B") ? "badge-secondary" :
                              "badge-danger"
                            }`}>{g.grade_letter ?? "–"}</span>
                          </td>
                          <td>{g.credits ?? "–"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          {mockAssignments.map((asgn) => {
            const sub = mySubs.find((s) => s.assignment_id === asgn.id);
            const isPast = new Date(asgn.deadline) < new Date();
            return (
              <div key={asgn.id} className="card card-interactive p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text-primary">{asgn.title}</h3>
                      {sub ? (
                        <span className={`badge ${sub.status === "Graded" ? "badge-success" : "badge-accent"}`}>
                          {sub.status}
                        </span>
                      ) : isPast ? (
                        <span className="badge badge-danger">Missed</span>
                      ) : (
                        <span className="badge badge-highlight">Pending</span>
                      )}
                    </div>
                    <p className="text-text-muted text-sm mt-1 line-clamp-2">{asgn.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {new Date(asgn.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span>Max marks: {asgn.max_marks}</span>
                      {sub?.marks !== undefined && (
                        <span className="text-success font-semibold">Scored: {sub.marks}/{asgn.max_marks}</span>
                      )}
                    </div>
                    {sub?.remarks && (
                      <div className="mt-2 text-xs text-text-muted italic">&quot;{sub.remarks}&quot;</div>
                    )}
                  </div>
                  {!sub && !isPast && (
                    <button className="btn-primary btn-sm flex-shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      Submit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grace Requests Tab */}
      {activeTab === "grace" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowGraceModal(true)} className="btn-primary btn-sm">
              <Plus className="w-3.5 h-3.5" />
              New Grace Request
            </button>
          </div>
          {graceList.map((req) => (
            <div key={req.id} className="card p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-text-primary">{req.subject_name}</h3>
                    <span className={`badge ${
                      req.status === "Approved" ? "badge-success" :
                      req.status === "Rejected" ? "badge-danger" :
                      req.status === "Forwarded" ? "badge-highlight" : "badge-accent"
                    }`}>{req.status}</span>
                  </div>
                  <p className="text-text-muted text-sm mt-1">{req.reason}</p>
                  <div className="text-xs text-text-muted mt-2 flex gap-4">
                    <span>Type: {req.reason_type}</span>
                    {req.date_from && <span>Period: {req.date_from} → {req.date_to}</span>}
                  </div>
                  {req.mentor_remarks && (
                    <div className="mt-2 text-xs text-secondary italic">
                      Mentor: &quot;{req.mentor_remarks}&quot;
                    </div>
                  )}
                </div>
                <div className="text-xs text-text-muted">
                  {new Date(req.created_at).toLocaleDateString("en-IN")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* New Grace Request Modal */}
      {showGraceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">New Grace Request</h2>
              <button onClick={() => setShowGraceModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGrace} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Subject</label>
                  <select name="subject" required className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent">
                    {mockAttendanceSummary.map(s => (
                      <option key={s.code} value={s.subject}>{s.subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Type</label>
                  <select name="type" required className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent">
                    <option value="Medical">Medical</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">From Date</label>
                  <input type="date" name="dateFrom" required className="input text-sm" style={{ colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="label">To Date</label>
                  <input type="date" name="dateTo" required className="input text-sm" style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              <div>
                <label className="label">Reason</label>
                <textarea name="reason" rows={3} required className="input py-2" placeholder="Briefly explain the reason for your absence..."></textarea>
              </div>
              <div>
                <label className="label">Supporting Document (Optional)</label>
                <input type="file" className="input text-xs py-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-colors" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowGraceModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
