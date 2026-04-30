"use client";

import AppShell from "@/components/AppShell";
import { 
  mockCourses, 
  mockEnrollments, 
  getEnrollmentsForStudent, 
  currentStudentUser,
  mockProfiles
} from "@/lib/mock-data";
import { BookOpen, CheckCircle2, BookmarkPlus, XOctagon, Clock } from "lucide-react";
import { useState } from "react";

export default function StudentCourses() {
  const user = currentStudentUser;
  
  // Initialize local state from the mock data
  const [enrollments, setEnrollments] = useState(getEnrollmentsForStudent(user.id));
  const [activeTab, setActiveTab] = useState<"catalog" | "enrolled">("catalog");

  // Get courses matching student's department
  const availableCourses = mockCourses.filter(
    (c) => c.department === user.department
  );

  const handleEnroll = (courseId: string) => {
    // Check if already enrolled
    if (enrollments.some(e => e.course_id === courseId && e.status === "Active")) return;

    const newEnrollment: any = {
      id: "enr-" + Date.now(),
      student_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      status: "Active"
    };

    // Mutate global mock to sync with Mentor/Admin roles in the same dev session
    mockEnrollments.push(newEnrollment);

    // Update local state for immediate re-render
    setEnrollments([...enrollments, newEnrollment]);
  };

  const handleDrop = (courseId: string) => {
    // Find the enrollment
    const enrollmentIndex = mockEnrollments.findIndex(
      e => e.student_id === user.id && e.course_id === courseId && e.status === "Active"
    );
    
    if (enrollmentIndex > -1) {
      // Mutate global mock
      mockEnrollments[enrollmentIndex].status = "Dropped";
      
      // Update local state
      setEnrollments(enrollments.filter(e => e.course_id !== courseId));
    }
  };

  const getFacultyName = (facultyId: string) => {
    const prof = mockProfiles.find((p) => p.id === facultyId);
    return prof?.full_name || "Unknown Faculty";
  };

  return (
    <AppShell
      role="student"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Course Registration</h1>
        <p className="text-text-muted text-sm mt-0.5">Manage your semester schedule and enrollments</p>
      </div>

      <div className="flex items-center gap-4 border-b border-surface-border mb-6">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "catalog" ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          Course Catalog
        </button>
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "enrolled" ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          My Schedule
          <span className="badge badge-accent py-0 !text-[10px]">{enrollments.length}</span>
        </button>
      </div>

      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {availableCourses.map((course) => {
            const isEnrolled = enrollments.some(e => e.course_id === course.id && e.status === "Active");
            return (
              <div key={course.id} className={`card p-5 border-2 transition-all duration-300 ${isEnrolled ? "border-accent/40 glow-accent" : "border-transparent"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  {isEnrolled && (
                    <span className="badge badge-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Enrolled
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-text-primary mb-1">{course.name}</h3>
                <div className="text-sm text-text-muted mb-4 space-y-1">
                  <div className="flex items-center gap-2"><span className="font-mono text-xs bg-surface border border-surface-border px-1.5 rounded">{course.code}</span></div>
                  <div>Faculty: {getFacultyName(course.faculty_id)}</div>
                  <div>Credits: 4</div>
                </div>
                
                <div className="pt-4 border-t border-surface-border">
                  {isEnrolled ? (
                    <button onClick={() => handleDrop(course.id)} className="btn-ghost w-full justify-center text-danger hover:text-danger hover:bg-danger/10">
                      <XOctagon className="w-4 h-4 mr-2" />
                      Drop Course
                    </button>
                  ) : (
                    <button onClick={() => handleEnroll(course.id)} className="btn-primary w-full justify-center">
                      <BookmarkPlus className="w-4 h-4 mr-2" />
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {availableCourses.length === 0 && (
            <div className="col-span-full card p-12 text-center">
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-text-muted">No courses available for your semester configuration.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "enrolled" && (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const course = mockCourses.find(c => c.id === enrollment.course_id);
            if (!course) return null;
            
            return (
              <div key={enrollment.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text-primary">{course.name}</h3>
                    <div className="text-sm text-text-muted flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs">{course.code}</span>
                      <span>•</span>
                      <span>{getFacultyName(course.faculty_id)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="text-sm text-text-muted flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </div>
                  <button onClick={() => handleDrop(course.id)} className="btn-ghost text-sm text-danger hover:text-danger hover:bg-danger/10 px-3 h-9">
                    Drop Section
                  </button>
                </div>
              </div>
            );
          })}
          
          {enrollments.length === 0 && (
            <div className="card p-12 text-center">
              <BookmarkPlus className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
              <h3 className="font-heading font-bold text-text-primary mb-1">No Active Enrollments</h3>
              <p className="text-text-muted mb-4">You have not registered for any courses this semester.</p>
              <button onClick={() => setActiveTab("catalog")} className="btn-primary mx-auto">Browse Catalog</button>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
