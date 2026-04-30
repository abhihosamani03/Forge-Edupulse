"use client";

import AppShell from "@/components/AppShell";
import { 
  mockCourses, 
  currentAdminUser, 
  getEnrollmentsForCourse, 
  mockProfiles 
} from "@/lib/mock-data";
import { BookOpen, Users, Search, Plus, UserPlus } from "lucide-react";
import { useState } from "react";

export default function AdminCourses() {
  const user = currentAdminUser;
  const [search, setSearch] = useState("");

  // A basic unfiltered list of courses since the admin manages everything globally
  const filteredCourses = mockCourses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code?.toLowerCase().includes(search.toLowerCase()) ||
    c.department?.toLowerCase().includes(search.toLowerCase())
  );

  const getFacultyName = (facultyId: string) => {
    const prof = mockProfiles.find((p) => p.id === facultyId);
    return prof?.full_name || "Unassigned";
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
          <h1 className="text-2xl font-heading font-bold text-text-primary">Course Administration</h1>
          <p className="text-text-muted text-sm mt-0.5">Global overview of courses, faculties, and student enrollments</p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => alert("Note: Course Creation prototype is active on Mentor portal")}>
          <Plus className="w-4 h-4" />
          Add Global Course
        </button>
      </div>

      <div className="card p-4 mb-6 sticky top-0 z-10 bg-background/90 backdrop-blur-xl">
        <div className="flex items-center bg-surface border border-surface-border rounded-input px-3 h-[42px] max-w-md">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <input
            type="text"
            placeholder="Search courses by name, code, or department..."
            className="bg-transparent border-none outline-none w-full text-text-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/3">Course Name</th>
                <th>Code</th>
                <th>Department</th>
                <th>Faculty</th>
                <th className="text-right">Enrolled Students</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => {
                const enrollmentCount = getEnrollmentsForCourse(course.id).length;
                return (
                  <tr key={course.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-text-primary whitespace-nowrap">{course.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-sm text-text-muted">{course.code}</td>
                    <td className="text-text-muted">{course.department}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-surface-border flex items-center justify-center text-[9px] font-bold text-text-primary">
                          {getFacultyName(course.faculty_id).split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm">{getFacultyName(course.faculty_id)}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-surface-border rounded-full">
                        <Users className="w-3.5 h-3.5 text-accent" />
                        <span className="font-bold font-mono text-sm">{enrollmentCount}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-muted">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No courses found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
