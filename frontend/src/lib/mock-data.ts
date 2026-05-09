// ══════════════════════════════════════════════════════════
// EduPulse — Mock Data for Development
// Sahyadri College of Engineering & Management, Mangalore
// ══════════════════════════════════════════════════════════

import {
  Profile,
  Allocation,
  Interaction,
  Grade,
  Achievement,
  Assignment,
  Submission,
  FeedPost,
  Notification,
  GraceRequest,
  Course,
  CourseMaterial,
  CourseEnrollment,
  CalendarEvent,
  ScheduleItem,
  AcademicHealth,
  PendingAction,
  AttendanceRecord,
} from "./types";

// ── Profiles ──
export const mockProfiles: Profile[] = [
  {
    id: "admin-001",
    role: "admin",
    full_name: "Dr. Manjunath Kotari",
    email: "admin@sahyadri.edu.in",
    avatar_url: "",
    department: "Administration",
    designation: "Principal",
    employee_id: "SAH-ADM-001",
    phone: "+91 9876543210",
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "mentor-001",
    role: "mentor",
    full_name: "Dr. Priya Shetty",
    email: "priya.shetty@sahyadri.edu.in",
    avatar_url: "",
    department: "Computer Science",
    designation: "Associate Professor",
    employee_id: "SAH-CS-042",
    phone: "+91 9876543211",
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "mentor-002",
    role: "mentor",
    full_name: "Prof. Raghavendra Rao",
    email: "raghav.rao@sahyadri.edu.in",
    avatar_url: "",
    department: "Computer Science",
    designation: "Assistant Professor",
    employee_id: "SAH-CS-057",
    phone: "+91 9876543212",
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "mentor-003",
    role: "mentor",
    full_name: "Dr. Ananya Kulkarni",
    email: "ananya.k@sahyadri.edu.in",
    avatar_url: "",
    department: "Electronics",
    designation: "Professor",
    employee_id: "SAH-EC-018",
    phone: "+91 9876543213",
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "student-001",
    role: "mentee",
    full_name: "ABHISHEK",
    email: "abhihosamani1967@gmail.com",
    avatar_url: "",
    department: "Computer Science & Information Science",
    year: 1,
    section: undefined,
    usn: "4SF24CI005",
    year_of_joining: 2024,
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "student-002",
    role: "mentee",
    full_name: "Meghana Nair",
    email: "meghana.n@sahyadri.edu.in",
    avatar_url: "",
    department: "Computer Science",
    year: 3,
    section: "A",
    usn: "4SH21CS025",
    year_of_joining: 2021,
    linkedin_url: "https://linkedin.com/in/meghana-nair",
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "student-003",
    role: "mentee",
    full_name: "Rohan Patel",
    email: "rohan.p@sahyadri.edu.in",
    avatar_url: "",
    department: "Computer Science",
    year: 2,
    section: "B",
    usn: "4SH22CS048",
    year_of_joining: 2022,
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "student-004",
    role: "mentee",
    full_name: "Sneha Bhat",
    email: "sneha.b@sahyadri.edu.in",
    avatar_url: "",
    department: "Electronics",
    year: 4,
    section: "A",
    usn: "4SH20EC012",
    year_of_joining: 2020,
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "student-005",
    role: "mentee",
    full_name: "Karthik Gowda",
    email: "karthik.g@sahyadri.edu.in",
    avatar_url: "",
    department: "Computer Science",
    year: 3,
    section: "A",
    usn: "4SH21CS030",
    year_of_joining: 2021,
    is_profile_complete: false,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "mentor-006",
    role: "mentor",
    full_name: "Dr. Ananya P",
    email: "ananya.p@sahyadri.edu.in",
    avatar_url: "",
    department: "Computer Science",
    designation: "Associate Professor",
    employee_id: "SH-CS-022",
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "mentor-007",
    role: "mentor",
    full_name: "Prof. Vikram Singh",
    email: "vikram.s@sahyadri.edu.in",
    avatar_url: "",
    department: "Mechanical",
    designation: "Assistant Professor",
    employee_id: "SH-ME-011",
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "student-006",
    role: "mentee",
    full_name: "Deepak R",
    email: "deepak.r@sahyadri.edu.in",
    avatar_url: "",
    department: "Mechanical",
    year: 2,
    section: "B",
    usn: "4SH22ME014",
    year_of_joining: 2022,
    is_profile_complete: true,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "student-007",
    role: "mentee",
    full_name: "Bhavana K",
    email: "bhavana.k@sahyadri.edu.in",
    avatar_url: "",
    department: "Electronics",
    year: 1,
    section: "C",
    usn: "4SH23EC005",
    year_of_joining: 2023,
    is_profile_complete: false,
    is_active: true,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  { id: "mentor-004", role: "mentor", full_name: "Prof. Ramesh Kumar", email: "ramesh.k@sahyadri.edu.in", department: "Information Science", designation: "Assistant Professor", employee_id: "SH-IS-014", is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "mentor-005", role: "mentor", full_name: "Dr. Sunita V", email: "sunita.v@sahyadri.edu.in", department: "Civil", designation: "Professor", employee_id: "SH-CV-005", is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "mentor-008", role: "mentor", full_name: "Prof. Ahmed Raza", email: "ahmed.r@sahyadri.edu.in", department: "Mechanical", designation: "Associate Professor", employee_id: "SH-ME-021", is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "mentor-009", role: "mentor", full_name: "Dr. Lakshmi Narayan", email: "lakshmi.n@sahyadri.edu.in", department: "Electronics", designation: "Associate Professor", employee_id: "SH-EC-029", is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "mentor-010", role: "mentor", full_name: "Prof. Kavitha M", email: "kavitha.m@sahyadri.edu.in", department: "Information Science", designation: "Assistant Professor", employee_id: "SH-IS-019", is_profile_complete: false, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-008", role: "mentee", full_name: "Aisha Khan", email: "aisha.k@sahyadri.edu.in", department: "Information Science", year: 2, section: "A", usn: "4SH22IS004", year_of_joining: 2022, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-009", role: "mentee", full_name: "Mohammed Zaid", email: "zaid.m@sahyadri.edu.in", department: "Civil", year: 4, section: "B", usn: "4SH20CV045", year_of_joining: 2020, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-010", role: "mentee", full_name: "Pooja Hegde", email: "pooja.h@sahyadri.edu.in", department: "Computer Science", year: 1, section: "C", usn: "4SH23CS089", year_of_joining: 2023, is_profile_complete: false, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-011", role: "mentee", full_name: "Samuel John", email: "samuel.j@sahyadri.edu.in", department: "Mechanical", year: 3, section: "A", usn: "4SH21ME033", year_of_joining: 2021, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-012", role: "mentee", full_name: "Nidhi Shetty", email: "nidhi.s@sahyadri.edu.in", department: "Information Science", year: 2, section: "B", usn: "4SH22IS067", year_of_joining: 2022, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-013", role: "mentee", full_name: "Varun Desai", email: "varun.d@sahyadri.edu.in", department: "Electronics", year: 4, section: "A", usn: "4SH20EC091", year_of_joining: 2020, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-014", role: "mentee", full_name: "Meera Reddy", email: "meera.r@sahyadri.edu.in", department: "Computer Science", year: 3, section: "B", usn: "4SH21CS112", year_of_joining: 2021, is_profile_complete: false, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-015", role: "mentee", full_name: "Rahul Verma", email: "rahul.v@sahyadri.edu.in", department: "Civil", year: 2, section: "A", usn: "4SH22CV018", year_of_joining: 2022, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-016", role: "mentee", full_name: "Anjali Menon", email: "anjali.m@sahyadri.edu.in", department: "Electronics", year: 1, section: "D", usn: "4SH23EC105", year_of_joining: 2023, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
  { id: "student-017", role: "mentee", full_name: "Yashaswi Gowda", email: "yash.g@sahyadri.edu.in", department: "Mechanical", year: 4, section: "B", usn: "4SH20ME077", year_of_joining: 2020, is_profile_complete: true, is_active: true, created_at: "2024-08-01T00:00:00Z", updated_at: "2024-08-01T00:00:00Z" },
];

// ── Allocations ──
export const mockAllocations: Allocation[] = [];

// ── Interactions ──
export const mockInteractions: Interaction[] = [];

// ── Grades ──
export const mockGrades: Grade[] = [];

// ── Achievements ──
export const mockAchievements: Achievement[] = [];

// ── Courses ──
export const mockCourses: Course[] = [];

// ── Course Enrollments ──
export const mockEnrollments: CourseEnrollment[] = [];

// ── Course Materials ──
export const mockMaterials: CourseMaterial[] = [];

// ── Assignments ──
export const mockAssignments: Assignment[] = [];

// ── Submissions ──
export const mockSubmissions: Submission[] = [];

// ── Feed Posts ──
export const mockFeed: FeedPost[] = [];

// ── Notifications ──
export const mockNotifications: Notification[] = [];

// ── Grace Requests ──
export const mockGraceRequests: GraceRequest[] = [];

// ── Academic Calendar ──
export const mockCalendar: CalendarEvent[] = [];

// ── Attendance Records (sample) ──
export const mockAttendanceRecords: AttendanceRecord[] = [];

// ── Schedule (for dashboard) ──
export const mockSchedule: ScheduleItem[] = [];

// ── Academic Health (for dashboard) ──
export const mockAcademicHealth: AcademicHealth = {
  cgpa: 0,
  attendance: 0,
  semesterGpas: [],
  healthStatus: "good",
};

// ── Pending Actions (for dashboard) ──
export const mockPendingActions: PendingAction[] = [];

// ── Attendance Summary per subject (for dashboard) ──
export const mockAttendanceSummary: { subject: string; code: string; total: number; present: number; percentage: number }[] = [];

// Helper to get current user (simulating login)
export const currentStudentUser = mockProfiles.find((p) => p.id === "student-001")!;
export const currentMentorUser = mockProfiles.find((p) => p.id === "mentor-001")!;
export const currentAdminUser = mockProfiles.find((p) => p.id === "admin-001")!;

// Helper to get mentor for a student
export function getMentorForStudent(studentId: string): Profile | undefined {
  const allocation = mockAllocations.find(
    (a) => a.mentee_id === studentId && a.is_active
  );
  if (!allocation) return undefined;
  return mockProfiles.find((p) => p.id === allocation.mentor_id);
}

// Helper to get mentees for a mentor
export function getMenteesForMentor(mentorId: string): Profile[] {
  const allocationIds = mockAllocations
    .filter((a) => a.mentor_id === mentorId && a.is_active)
    .map((a) => a.mentee_id);
  return mockProfiles.filter((p) => allocationIds.includes(p.id));
}

// Helper to get grades for student
export function getGradesForStudent(studentId: string): Grade[] {
  return mockGrades.filter((g) => g.student_id === studentId);
}

// Helper to get achievements for student
export function getAchievementsForStudent(studentId: string): Achievement[] {
  return mockAchievements.filter((a) => a.student_id === studentId);
}

// Helper to calculate NBA score
export function calculateNbaScore(studentId: string): number {
  return mockAchievements
    .filter((a) => a.student_id === studentId && a.status === "Verified")
    .reduce((sum, a) => sum + a.nba_points, 0);
}

// Helpers for enrollments
export function getEnrollmentsForStudent(studentId: string): CourseEnrollment[] {
  return mockEnrollments.filter((e) => e.student_id === studentId && e.status === "Active");
}

export function getEnrollmentsForCourse(courseId: string): CourseEnrollment[] {
  return mockEnrollments.filter((e) => e.course_id === courseId && e.status === "Active");
}
