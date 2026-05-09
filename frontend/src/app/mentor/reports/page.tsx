"use client";
import AppShell from "@/components/AppShell";
import { currentMentorUser, getMenteesForMentor, mockGrades, mockAchievements, mockAttendanceSummary, calculateNbaScore } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/export";
import { Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function MentorReports() {
  const user = currentMentorUser;
  const mentees = getMenteesForMentor(user.id);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const data = mentees.map(m => {
      const grades = mockGrades.filter(g => g.student_id === m.id);
      const latestGrade = grades[grades.length - 1];
      const verifiedAchs = mockAchievements.filter((a) => a.student_id === m.id && a.status === "Verified").length;
      return {
        Student_Name: m.full_name,
        USN: m.usn,
        Email: m.email,
        Latest_CGPA: latestGrade?.cgpa ?? "N/A",
        NBA_Score: calculateNbaScore(m.id),
        Verified_Achievements: verifiedAchs
      };
    });
    setTimeout(() => {
      downloadCSV(data, "Mentees_Academic_Report");
      setDownloading(false);
    }, 800);
  };
  return (
    <AppShell role="mentor" userName={user.full_name} userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Reports</h1>
          <p className="text-text-muted text-sm mt-0.5">Academic performance summary for your mentees</p>
        </div>
        <button onClick={handleDownload} disabled={downloading} className="btn-primary">
          {downloading ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
          {downloading ? "Generating..." : "Download CSV"}
        </button>
      </div>
      <div className="card p-5">
        <table className="data-table">
          <thead><tr><th>Student</th><th>USN</th><th>Latest CGPA</th><th>NBA Score</th><th>Achievements</th></tr></thead>
          <tbody>
            {mentees.map((m) => {
              const grades = mockGrades.filter((g) => g.student_id === m.id);
              const latestGrade = grades[grades.length - 1];
              return (
                <tr key={m.id}>
                  <td className="font-medium">{m.full_name}</td>
                  <td className="font-mono text-xs text-text-muted">{m.usn}</td>
                  <td><span className="badge badge-accent">{latestGrade?.cgpa ?? "N/A"}</span></td>
                  <td><span className="text-accent font-semibold">{calculateNbaScore(m.id)} pts</span></td>
                  <td>{mockAchievements.filter((a) => a.student_id === m.id && a.status === "Verified").length} verified</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
