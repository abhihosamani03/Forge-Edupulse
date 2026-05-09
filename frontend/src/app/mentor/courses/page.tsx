"use client";

import AppShell from "@/components/AppShell";
import { mockCourses, mockMaterials, mockAssignments, mockSubmissions, mockProfiles, currentMentorUser, getEnrollmentsForCourse } from "@/lib/mock-data";
import { BookOpen, Upload, Plus, FileText, Clock, ChevronRight, X, User } from "lucide-react";
import { useState } from "react";

export default function MentorCourses() {
  const user = currentMentorUser;
  // Local state for mutations
  const [coursesList, setCoursesList] = useState(mockCourses.filter((c) => c.faculty_id === user.id));
  const [selectedCourse, setSelectedCourse] = useState(coursesList[0] ?? null);
  
  const [materialsList, setMaterialsList] = useState(mockMaterials);
  const [assignmentsList, setAssignmentsList] = useState(mockAssignments);

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Expanded assignment view state
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);

  const courseMaterials = materialsList.filter((m) => m.course_id === selectedCourse?.id);
  const courseAssignments = assignmentsList.filter((a) => a.course_id === selectedCourse?.id);

  const handleAddCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newCourse: any = {
      id: "course-" + Date.now(),
      code: fd.get("code"),
      name: fd.get("name"),
      department: user.department,
      semester: Number(fd.get("semester")),
      academic_year: "2024-2025",
      faculty_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCoursesList([...coursesList, newCourse]);
    setShowCourseModal(false);
  };

  const handleAddMaterial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newMat: any = {
      id: "mat-" + Date.now(),
      course_id: selectedCourse.id,
      title: fd.get("title"),
      description: fd.get("description") || "",
      file_url: "dummy-url",
      file_type: fd.get("file_type") || "pdf",
      uploaded_at: new Date().toISOString(),
    };
    setMaterialsList([...materialsList, newMat]);
    setShowMaterialModal(false);
  };

  const handleAddAssignment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newAsg: any = {
      id: "asg-" + Date.now(),
      course_id: selectedCourse.id,
      title: fd.get("title"),
      description: fd.get("description") || "",
      deadline: fd.get("deadline"),
      max_marks: Number(fd.get("max_marks")),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAssignmentsList([...assignmentsList, newAsg]);
    setShowAssignmentModal(false);
  };

  return (
    <AppShell
      role="mentor"
      userName={user.full_name}
      userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    >
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">My Courses</h1>
          <p className="text-text-muted text-sm mt-0.5">Manage materials &amp; assignments</p>
        </div>
        <button onClick={() => setShowCourseModal(true)} className="btn-primary btn-sm">
          <Plus className="w-3.5 h-3.5" />
          New Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course list */}
        <div className="space-y-2 lg:max-h-[80vh] overflow-y-auto scrollbar-hide pr-2">
          {coursesList.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`w-full text-left card p-4 transition-all duration-200 ${
                selectedCourse?.id === course.id ? "border-accent/40 glow-accent" : "card-interactive"
              }`}
            >
              <div className="flex items-start gap-3">
                <BookOpen className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedCourse?.id === course.id ? "text-accent" : "text-text-muted"}`} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary leading-snug">{course.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{course.code} · Sem {course.semester}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Course detail */}
        <div className="lg:col-span-3 space-y-5">
          {selectedCourse ? (
            <>
              <div className="card p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-heading font-bold text-text-primary text-lg">{selectedCourse.name}</h2>
                    <div className="text-text-muted text-sm mt-0.5">
                      {selectedCourse.code} · Semester {selectedCourse.semester} · {selectedCourse.department} · {selectedCourse.academic_year}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-heading text-accent">{getEnrollmentsForCourse(selectedCourse.id).length}</div>
                    <div className="text-xs text-text-muted">Students Enrolled</div>
                  </div>
                </div>
              </div>

              {/* Enrolled Students Overview */}
              <div className="card p-5">
                <h3 className="font-semibold text-text-primary mb-3">Live Roster</h3>
                <div className="flex flex-wrap gap-2">
                  {getEnrollmentsForCourse(selectedCourse.id).map(e => {
                     const stu = mockProfiles.find(p => p.id === e.student_id);
                     return (
                       <div key={e.id} className="badge badge-secondary flex items-center gap-2 py-1.5 px-3">
                         <div className="w-5 h-5 rounded-full bg-surface text-[9px] flex items-center justify-center font-bold text-text-primary shrink-0">
                           {stu?.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                         </div>
                         <span>{stu?.full_name || "Unknown"}</span>
                         <span className="font-mono text-[10px] opacity-70 border-l border-text-muted pl-2 ml-1">{stu?.usn}</span>
                       </div>
                     )
                  })}
                  {getEnrollmentsForCourse(selectedCourse.id).length === 0 && (
                     <span className="text-sm text-text-muted italic">No students currently enrolled.</span>
                  )}
                </div>
              </div>

              {/* Materials */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Study Materials</h3>
                  <button onClick={() => setShowMaterialModal(true)} className="btn-primary btn-sm">
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                </div>
                <div className="space-y-3">
                  {courseMaterials.map((mat) => (
                    <div key={mat.id} className="flex items-center gap-3 p-3 rounded-button hover:bg-accent/5 transition-colors border border-surface-border">
                      <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary">{mat.title}</div>
                        {mat.description && <div className="text-xs text-text-muted mt-0.5">{mat.description}</div>}
                      </div>
                      <span className="text-xs uppercase text-text-muted font-mono">{mat.file_type}</span>
                    </div>
                  ))}
                  {courseMaterials.length === 0 && (
                    <p className="text-text-muted text-sm text-center py-4">No materials uploaded yet.</p>
                  )}
                </div>
              </div>

              {/* Assignments */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Assignments</h3>
                  <button onClick={() => setShowAssignmentModal(true)} className="btn-primary btn-sm">
                    <Plus className="w-3.5 h-3.5" />
                    Create
                  </button>
                </div>
                <div className="space-y-3">
                  {courseAssignments.map((asgn) => (
                    <div key={asgn.id} className="card card-interactive p-4">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div>
                          <div className="font-semibold text-sm text-text-primary">{asgn.title}</div>
                          <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{asgn.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Due: {new Date(asgn.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                            <span>Max: {asgn.max_marks} marks</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setExpandedAssignmentId(expandedAssignmentId === asgn.id ? null : asgn.id)}
                          className="btn-ghost btn-sm text-xs"
                        >
                          {expandedAssignmentId === asgn.id ? "Hide Submissions" : "View Submissions"} 
                          <ChevronRight className={`w-3 h-3 transition-transform ${expandedAssignmentId === asgn.id ? "rotate-90" : ""}`} />
                        </button>
                      </div>
                      
                      {/* Expanded Submissions Inline */}
                      {expandedAssignmentId === asgn.id && (
                        <div className="mt-4 pt-4 border-t border-surface-border animate-fade-in-up">
                          <h4 className="text-xs font-semibold text-text-muted mb-3">Student Submissions</h4>
                          <div className="space-y-2">
                            {mockSubmissions.filter(s => s.assignment_id === asgn.id).length > 0 ? (
                              mockSubmissions.filter(s => s.assignment_id === asgn.id).map(sub => {
                                const student = mockProfiles.find(p => p.id === sub.student_id);
                                return (
                                  <div key={sub.id} className="flex flex-wrap items-center justify-between p-2 rounded-button bg-surface border border-surface-border text-sm">
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4 text-text-muted" />
                                      <span className="font-medium text-text-primary">{student?.full_name || "Unknown Student"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className={`badge ${sub.status === "Graded" ? "badge-success" : "badge-accent"}`}>
                                        {sub.status}
                                      </span>
                                      {sub.marks !== undefined ? (
                                        <span className="font-mono text-xs font-semibold">{sub.marks}/{asgn.max_marks} marks</span>
                                      ) : (
                                        <button className="btn-primary btn-sm h-7 text-[10px] px-2">Grade</button>
                                      )}
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <p className="text-xs text-text-muted italic">No submissions received yet.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {courseAssignments.length === 0 && (
                    <p className="text-text-muted text-sm text-center py-4">No assignments yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card p-12 text-center">
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-text-muted">Select a course to manage</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">Add New Course</h2>
              <button onClick={() => setShowCourseModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Course Name</label>
                  <input type="text" name="name" required className="input" placeholder="e.g. Database Management Systems" />
                </div>
                <div>
                  <label className="label">Course Code</label>
                  <input type="text" name="code" required className="input" placeholder="e.g. 21CS54" />
                </div>
                <div>
                  <label className="label">Semester</label>
                  <input type="number" name="semester" min="1" max="8" required className="input" placeholder="e.g. 5" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Material Modal */}
      {showMaterialModal && selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">Upload Material for {selectedCourse.code}</h2>
              <button onClick={() => setShowMaterialModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMaterial} className="p-5 space-y-4">
              <div>
                <label className="label">Title</label>
                <input type="text" name="title" required className="input" placeholder="e.g. Module 1 Notes" />
              </div>
              <div>
                <label className="label">Description (Optional)</label>
                <textarea name="description" rows={2} className="input py-2" placeholder="Brief description of the material..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">File Type Label</label>
                  <input type="text" name="file_type" required defaultValue="pdf" className="input" />
                </div>
                <div>
                  <label className="label">Select File</label>
                  <input type="file" required className="input py-2 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowMaterialModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showAssignmentModal && selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">New Assignment for {selectedCourse.code}</h2>
              <button onClick={() => setShowAssignmentModal(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAssignment} className="p-5 space-y-4">
              <div>
                <label className="label">Title</label>
                <input type="text" name="title" required className="input" placeholder="e.g. Assignment 1: SQL Queries" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea name="description" required rows={3} className="input py-2" placeholder="Detail the questions or requirements..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Deadline</label>
                  <input type="datetime-local" name="deadline" required className="input text-sm" style={{ colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="label">Max Marks</label>
                  <input type="number" name="max_marks" required min="1" max="100" defaultValue="10" className="input" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAssignmentModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Create Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
