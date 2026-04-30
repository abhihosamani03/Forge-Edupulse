"use client";

import AppShell from "@/components/AppShell";
import { currentAdminUser, mockProfiles, mockAchievements } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/export";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function AdminReports() {
  const user = currentAdminUser;
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadStudents = () => {
    setDownloading("students");
    const students = mockProfiles.filter(p => p.role === "mentee");
    const data = students.map(s => ({
      ID: s.id,
      FullName: s.full_name,
      USN: s.usn,
      Email: s.email,
      Department: s.department,
      ProfileComplete: s.is_profile_complete ? "Yes" : "No",
      Status: s.is_active ? "Active" : "Inactive"
    }));
    setTimeout(() => {
      downloadCSV(data, "System_Students_Report");
      setDownloading(null);
    }, 800);
  };

  const handleDownloadFaculty = () => {
    setDownloading("faculty");
    const faculty = mockProfiles.filter(p => p.role === "mentor");
    const data = faculty.map(f => ({
      ID: f.id,
      FullName: f.full_name,
      EmployeeID: f.employee_id,
      Email: f.email,
      Department: f.department,
      Designation: f.designation,
      Status: f.is_active ? "Active" : "Inactive"
    }));
    setTimeout(() => {
      downloadCSV(data, "System_Faculty_Report");
      setDownloading(null);
    }, 800);
  };

  const handleDownloadAchievements = () => {
    setDownloading("achievements");
    const data = mockAchievements.map(a => {
      const student = mockProfiles.find(p => p.id === a.student_id);
      return {
        StudentName: student?.full_name || "Unknown",
        USN: student?.usn || "N/A",
        Title: a.title,
        Category: a.category,
        Status: a.status,
        NBAPoints: a.nba_points,
        Date: a.date
      };
    });
    setTimeout(() => {
      downloadCSV(data, "System_Achievements_Report");
      setDownloading(null);
    }, 800);
  };

  return (
    <AppShell
      role="admin"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">System Reports</h1>
        <p className="text-text-muted text-sm mt-0.5">Generate and download platform-wide analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-text-primary">Students Master List</h2>
              <p className="text-text-muted text-sm mt-1">Export a complete roster of all students registered on the platform.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <button onClick={handleDownloadStudents} disabled={downloading !== null} className="btn-primary w-full mt-4">
            {downloading === "students" ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
            {downloading === "students" ? "Generating..." : "Download CSV"}
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-text-primary">Faculty Master List</h2>
              <p className="text-text-muted text-sm mt-1">Export a complete roster of all faculty members on the platform.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <button onClick={handleDownloadFaculty} disabled={downloading !== null} className="btn-secondary w-full mt-4">
            {downloading === "faculty" ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
            {downloading === "faculty" ? "Generating..." : "Download CSV"}
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-text-primary">Platform Achievements</h2>
              <p className="text-text-muted text-sm mt-1">Export all logged achievements across the entire institution.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center flex-shrink-0 text-highlight">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <button onClick={handleDownloadAchievements} disabled={downloading !== null} className="btn-primary w-full mt-4 bg-highlight hover:bg-highlight/90 border-highlight text-white outline-highlight">
            {downloading === "achievements" ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
            {downloading === "achievements" ? "Generating..." : "Download CSV"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
