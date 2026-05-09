"use client";

import AppShell from "@/components/AppShell";
import AttendanceUploader from "@/components/admin/AttendanceUploader";
import { currentMentorUser } from "@/lib/mock-data";

export default function MentorAttendanceUploadPage() {
  const user = currentMentorUser;

  return (
    <AppShell
      role="mentor"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Bulk Attendance Upload
        </h1>
        <p className="text-text-muted text-sm mt-0.5">
          Upload Excel or CSV attendance sheets — AI will automatically map columns and sync records to the database.
        </p>
      </div>

      <AttendanceUploader />
    </AppShell>
  );
}
