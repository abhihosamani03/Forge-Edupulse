"use client";

import AppShell from "@/components/AppShell";
import { mockCalendar, currentStudentUser } from "@/lib/mock-data";
import { CalendarDays } from "lucide-react";

const TYPE_COLOR: Record<string, string> = {
  Exam: "bg-danger/10 border-danger/30 text-danger",
  Holiday: "bg-success/10 border-success/30 text-success",
  Event: "bg-highlight/10 border-highlight/30 text-highlight",
  Submission: "bg-accent/10 border-accent/30 text-accent",
  Other: "bg-secondary/10 border-secondary/30 text-secondary",
};

export default function StudentCalendar() {
  const user = currentStudentUser;

  return (
    <AppShell
      role="student"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Academic Calendar</h1>
        <p className="text-text-muted text-sm mt-0.5">Upcoming exams, holidays &amp; events for 2024–25</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockCalendar
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event) => {
            const type = event.type ?? "Other";
            return (
              <div key={event.id} className={`card p-5 border ${TYPE_COLOR[type] ?? TYPE_COLOR.Other}`}>
                <div className="flex items-start gap-4">
                  <div className="text-center flex-shrink-0">
                    <div className="text-2xl font-heading font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs uppercase">
                      {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-text-primary">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge text-xs border ${TYPE_COLOR[type]}`}>{type}</span>
                      {event.end_date && event.end_date !== event.date && (
                        <span className="text-xs text-text-muted">
                          until {new Date(event.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </AppShell>
  );
}
