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
    full_name: "Aditya Sharma",
    email: "aditya.s@sahyadri.edu.in",
    avatar_url: "",
    department: "Computer Science",
    year: 3,
    section: "A",
    usn: "4SH21CS001",
    year_of_joining: 2021,
    linkedin_url: "https://linkedin.com/in/aditya-sharma",
    github_url: "https://github.com/adityasharma",
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
export const mockAllocations: Allocation[] = [
  { id: "alloc-001", mentor_id: "mentor-001", mentee_id: "student-001", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-002", mentor_id: "mentor-001", mentee_id: "student-002", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-003", mentor_id: "mentor-001", mentee_id: "student-005", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-004", mentor_id: "mentor-002", mentee_id: "student-003", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-005", mentor_id: "mentor-003", mentee_id: "student-004", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-006", mentor_id: "mentor-004", mentee_id: "student-008", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-007", mentor_id: "mentor-005", mentee_id: "student-009", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-008", mentor_id: "mentor-002", mentee_id: "student-010", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-009", mentor_id: "mentor-008", mentee_id: "student-011", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-010", mentor_id: "mentor-004", mentee_id: "student-012", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-011", mentor_id: "mentor-009", mentee_id: "student-013", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-012", mentor_id: "mentor-001", mentee_id: "student-014", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-013", mentor_id: "mentor-005", mentee_id: "student-015", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-014", mentor_id: "mentor-009", mentee_id: "student-016", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
  { id: "alloc-015", mentor_id: "mentor-008", mentee_id: "student-017", allocated_at: "2024-08-15T00:00:00Z", is_active: true },
];

// ── Interactions ──
export const mockInteractions: Interaction[] = [
  {
    id: "int-001", mentor_id: "mentor-001", mentee_id: "student-001",
    date: "2024-10-15", duration_minutes: 30, type: "Academic",
    topics: "Mid-semester preparation, DBMS concepts review",
    remarks: "Student is well-prepared. Suggested additional practice problems.",
    follow_up_required: true, follow_up_notes: "Check DBMS assignment completion",
    next_interaction_date: "2024-11-01", mode: "In-Person",
    is_acknowledged: true, acknowledged_at: "2024-10-16T10:00:00Z",
    is_follow_up_resolved: true,
    created_at: "2024-10-15T10:00:00Z", updated_at: "2024-10-15T10:00:00Z",
  },
  {
    id: "int-002", mentor_id: "mentor-001", mentee_id: "student-001",
    date: "2024-11-01", duration_minutes: 45, type: "Career",
    topics: "Internship opportunities, resume review, placement preparation",
    remarks: "Reviewed resume. Advised on improving project descriptions. Shared placement prep timeline.",
    follow_up_required: true, follow_up_notes: "Send updated resume by Nov 10",
    next_interaction_date: "2024-11-15", mode: "In-Person",
    is_acknowledged: true, acknowledged_at: "2024-11-02T08:00:00Z",
    is_follow_up_resolved: false,
    created_at: "2024-11-01T10:00:00Z", updated_at: "2024-11-01T10:00:00Z",
  },
  {
    id: "int-003", mentor_id: "mentor-001", mentee_id: "student-002",
    date: "2024-10-20", duration_minutes: 25, type: "Personal",
    topics: "Time management, balancing extracurriculars with academics",
    remarks: "Discussed strategies for prioritizing tasks. Student seems motivated.",
    follow_up_required: false, mode: "Online",
    is_acknowledged: false, is_follow_up_resolved: false,
    created_at: "2024-10-20T14:00:00Z", updated_at: "2024-10-20T14:00:00Z",
  },
  {
    id: "int-004", mentor_id: "mentor-001", mentee_id: "student-005",
    date: "2024-11-05", duration_minutes: 20, type: "Academic",
    topics: "Low attendance warning, subject backlog discussion",
    remarks: "Student has attendance below 70% in OS. Warned about consequences.",
    follow_up_required: true, follow_up_notes: "Verify attendance improvement by Nov 20",
    next_interaction_date: "2024-11-20", mode: "In-Person",
    is_acknowledged: false, is_follow_up_resolved: false,
    created_at: "2024-11-05T11:00:00Z", updated_at: "2024-11-05T11:00:00Z",
  },
];

// ── Grades ──
export const mockGrades: Grade[] = [
  // Student-001 (Aditya) - Semester 1-5
  { id: "g-001", student_id: "student-001", semester: 1, subject_name: "Engineering Mathematics I", subject_code: "21MAT11", internal_marks: 38, external_marks: 48, total_marks: 86, grade_letter: "S", credits: 4, grade_points: 10, sgpa: 8.5, cgpa: 8.5, backlogs: 0, academic_year: "2021-22", created_at: "2022-02-01T00:00:00Z" },
  { id: "g-002", student_id: "student-001", semester: 1, subject_name: "Engineering Physics", subject_code: "21PHY12", internal_marks: 35, external_marks: 42, total_marks: 77, grade_letter: "A", credits: 4, grade_points: 9, sgpa: 8.5, cgpa: 8.5, backlogs: 0, academic_year: "2021-22", created_at: "2022-02-01T00:00:00Z" },
  { id: "g-003", student_id: "student-001", semester: 1, subject_name: "Basic Electrical Engineering", subject_code: "21ELE13", internal_marks: 32, external_marks: 38, total_marks: 70, grade_letter: "B+", credits: 3, grade_points: 8, sgpa: 8.5, cgpa: 8.5, backlogs: 0, academic_year: "2021-22", created_at: "2022-02-01T00:00:00Z" },
  { id: "g-004", student_id: "student-001", semester: 2, subject_name: "Engineering Mathematics II", subject_code: "21MAT21", internal_marks: 40, external_marks: 52, total_marks: 92, grade_letter: "S", credits: 4, grade_points: 10, sgpa: 8.8, cgpa: 8.65, backlogs: 0, academic_year: "2021-22", created_at: "2022-07-01T00:00:00Z" },
  { id: "g-005", student_id: "student-001", semester: 2, subject_name: "Programming in C", subject_code: "21CPS23", internal_marks: 42, external_marks: 55, total_marks: 97, grade_letter: "S", credits: 4, grade_points: 10, sgpa: 8.8, cgpa: 8.65, backlogs: 0, academic_year: "2021-22", created_at: "2022-07-01T00:00:00Z" },
  { id: "g-006", student_id: "student-001", semester: 3, subject_name: "Data Structures", subject_code: "21CS31", internal_marks: 45, external_marks: 56, total_marks: 101, grade_letter: "S", credits: 4, grade_points: 10, sgpa: 9.1, cgpa: 8.8, backlogs: 0, academic_year: "2022-23", created_at: "2023-02-01T00:00:00Z" },
  { id: "g-007", student_id: "student-001", semester: 4, subject_name: "Design & Analysis of Algorithms", subject_code: "21CS42", internal_marks: 36, external_marks: 44, total_marks: 80, grade_letter: "A", credits: 4, grade_points: 9, sgpa: 8.6, cgpa: 8.75, backlogs: 0, academic_year: "2022-23", created_at: "2023-07-01T00:00:00Z" },
  { id: "g-008", student_id: "student-001", semester: 5, subject_name: "DBMS", subject_code: "21CS51", internal_marks: 40, external_marks: 50, total_marks: 90, grade_letter: "S", credits: 4, grade_points: 10, sgpa: 9.0, cgpa: 8.8, backlogs: 0, academic_year: "2023-24", created_at: "2024-02-01T00:00:00Z" },
  { id: "g-009", student_id: "student-001", semester: 5, subject_name: "Computer Networks", subject_code: "21CS52", internal_marks: 35, external_marks: 40, total_marks: 75, grade_letter: "A", credits: 4, grade_points: 9, sgpa: 9.0, cgpa: 8.8, backlogs: 0, academic_year: "2023-24", created_at: "2024-02-01T00:00:00Z" },
  { id: "g-010", student_id: "student-001", semester: 5, subject_name: "Operating Systems", subject_code: "21CS53", internal_marks: 38, external_marks: 45, total_marks: 83, grade_letter: "A", credits: 4, grade_points: 9, sgpa: 9.0, cgpa: 8.8, backlogs: 0, academic_year: "2023-24", created_at: "2024-02-01T00:00:00Z" },
  // Student-005 (Karthik) - lower grades for contrast
  { id: "g-011", student_id: "student-005", semester: 1, subject_name: "Engineering Mathematics I", subject_code: "21MAT11", internal_marks: 22, external_marks: 28, total_marks: 50, grade_letter: "C", credits: 4, grade_points: 6, sgpa: 5.8, cgpa: 5.8, backlogs: 1, academic_year: "2021-22", created_at: "2022-02-01T00:00:00Z" },
  { id: "g-012", student_id: "student-005", semester: 2, subject_name: "Programming in C", subject_code: "21CPS23", internal_marks: 28, external_marks: 30, total_marks: 58, grade_letter: "C+", credits: 4, grade_points: 7, sgpa: 6.2, cgpa: 6.0, backlogs: 1, academic_year: "2021-22", created_at: "2022-07-01T00:00:00Z" },
];

// ── Achievements ──
export const mockAchievements: Achievement[] = [
  {
    id: "ach-001", student_id: "student-001", title: "Smart India Hackathon 2024 — Winner",
    category: "Hackathon", issuing_body: "Ministry of Education, Govt. of India",
    date: "2024-03-15", level: "National",
    description: "Developed an AI-powered grievance redressal system. Won first prize in the Software Edition.",
    nba_points: 50, status: "Verified", verified_by: "mentor-001", verified_at: "2024-03-20T10:00:00Z",
    created_at: "2024-03-16T00:00:00Z",
  },
  {
    id: "ach-002", student_id: "student-001", title: "AWS Certified Cloud Practitioner",
    category: "Certification", issuing_body: "Amazon Web Services",
    date: "2024-06-10", level: "International",
    description: "Cloud computing fundamentals certification covering AWS core services.",
    nba_points: 30, status: "Verified", verified_by: "mentor-001", verified_at: "2024-06-15T10:00:00Z",
    created_at: "2024-06-11T00:00:00Z",
  },
  {
    id: "ach-003", student_id: "student-001", title: "Research Paper — ML-based Attendance System",
    category: "Paper Publication", issuing_body: "IEEE Conference on AI Applications",
    date: "2024-08-20", level: "International",
    description: "Published a paper on face-recognition based automated attendance system using deep learning.",
    nba_points: 60, status: "Verified", verified_by: "mentor-001", verified_at: "2024-08-25T10:00:00Z",
    created_at: "2024-08-21T00:00:00Z",
  },
  {
    id: "ach-004", student_id: "student-002", title: "Google Summer of Code 2024",
    category: "Internship", issuing_body: "Google",
    date: "2024-05-01", level: "International",
    description: "Contributed to open-source project under GSoC. Developed a real-time collaboration framework.",
    nba_points: 60, status: "Verified", verified_by: "mentor-001", verified_at: "2024-09-01T10:00:00Z",
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "ach-005", student_id: "student-001", title: "Inter-College Coding Contest — 2nd Place",
    category: "Hackathon", issuing_body: "VTU",
    date: "2024-09-10", level: "State",
    description: "Secured 2nd position in VTU level competitive programming contest.",
    nba_points: 20, status: "Pending",
    created_at: "2024-09-11T00:00:00Z",
  },
  {
    id: "ach-006", student_id: "student-005", title: "NSS Special Camp Volunteer",
    category: "NSS/NCC", issuing_body: "NSS Unit, Sahyadri College",
    date: "2024-01-15", level: "College",
    description: "Participated in 7-day residential camp for rural development activities.",
    nba_points: 10, status: "Pending",
    created_at: "2024-09-20T00:00:00Z",
  },
];

// ── Courses ──
export const mockCourses: Course[] = [
  { id: "course-001", faculty_id: "mentor-001", name: "Database Management Systems", code: "21CS51", semester: 5, department: "Computer Science", academic_year: "2024-25", created_at: "2024-08-01T00:00:00Z" },
  { id: "course-002", faculty_id: "mentor-001", name: "Computer Networks", code: "21CS52", semester: 5, department: "Computer Science", academic_year: "2024-25", created_at: "2024-08-01T00:00:00Z" },
  { id: "course-003", faculty_id: "mentor-002", name: "Operating Systems", code: "21CS53", semester: 5, department: "Computer Science", academic_year: "2024-25", created_at: "2024-08-01T00:00:00Z" },
  { id: "course-004", faculty_id: "mentor-001", name: "Machine Learning", code: "21CS61", semester: 6, department: "Computer Science", academic_year: "2024-25", created_at: "2024-08-01T00:00:00Z" },
  { id: "course-005", faculty_id: "mentor-002", name: "Software Engineering", code: "21CS54", semester: 5, department: "Computer Science", academic_year: "2024-25", created_at: "2024-08-01T00:00:00Z" },
  { id: "course-006", faculty_id: "mentor-003", name: "Microcontrollers", code: "21EC51", semester: 5, department: "Electronics", academic_year: "2024-25", created_at: "2024-08-01T00:00:00Z" },
  { id: "course-007", faculty_id: "mentor-003", name: "Digital Signal Processing", code: "21EC52", semester: 5, department: "Electronics", academic_year: "2024-25", created_at: "2024-08-01T00:00:00Z" },
];

// ── Course Enrollments ──
export const mockEnrollments: CourseEnrollment[] = [
  { id: "enr-001", student_id: "student-001", course_id: "course-001", enrolled_at: "2024-08-10T10:00:00Z", status: "Active" },
  { id: "enr-002", student_id: "student-001", course_id: "course-002", enrolled_at: "2024-08-10T10:00:00Z", status: "Active" },
  { id: "enr-003", student_id: "student-002", course_id: "course-001", enrolled_at: "2024-08-11T10:00:00Z", status: "Active" },
  { id: "enr-004", student_id: "student-005", course_id: "course-001", enrolled_at: "2024-08-12T10:00:00Z", status: "Active" },
];

// ── Course Materials ──
export const mockMaterials: CourseMaterial[] = [
  { id: "mat-001", course_id: "course-001", title: "Module 1 — Introduction to DBMS", description: "ER modeling, relational model basics", file_url: "/files/dbms-module1.pdf", file_type: "pdf", uploaded_by: "mentor-001", created_at: "2024-08-10T00:00:00Z" },
  { id: "mat-002", course_id: "course-001", title: "Module 2 — SQL Fundamentals", description: "DDL, DML, DCL operations", file_url: "/files/dbms-module2.pdf", file_type: "pdf", uploaded_by: "mentor-001", created_at: "2024-08-20T00:00:00Z" },
  { id: "mat-003", course_id: "course-002", title: "Module 1 — OSI Model & TCP/IP", description: "Layered architecture, protocols overview", file_url: "/files/cn-module1.pdf", file_type: "pdf", uploaded_by: "mentor-001", created_at: "2024-08-12T00:00:00Z" },
  { id: "mat-004", course_id: "course-001", title: "Module 3 — Normalization", description: "1NF, 2NF, 3NF, BCNF with examples", file_url: "/files/dbms-module3.pdf", file_type: "pdf", uploaded_by: "mentor-001", created_at: "2024-09-01T00:00:00Z" },
];

// ── Assignments ──
export const mockAssignments: Assignment[] = [
  { id: "asgn-001", course_id: "course-001", title: "ER Diagram Design", description: "Design an ER diagram for a hospital management system with at least 6 entities and proper cardinality constraints.", deadline: "2024-11-10T23:59:00Z", max_marks: 20, created_by: "mentor-001", created_at: "2024-10-25T00:00:00Z" },
  { id: "asgn-002", course_id: "course-001", title: "SQL Queries Lab", description: "Write SQL queries for the given problem set. Include JOIN, GROUP BY, and nested queries.", deadline: "2024-11-20T23:59:00Z", max_marks: 25, created_by: "mentor-001", created_at: "2024-11-01T00:00:00Z" },
  { id: "asgn-003", course_id: "course-002", title: "Socket Programming Project", description: "Implement a simple client-server chat application using TCP sockets in C/Python.", deadline: "2024-12-01T23:59:00Z", max_marks: 30, created_by: "mentor-001", created_at: "2024-11-10T00:00:00Z" },
];

// ── Submissions ──
export const mockSubmissions: Submission[] = [
  { id: "sub-001", assignment_id: "asgn-001", student_id: "student-001", file_url: "/files/sub-aditya-er.pdf", submitted_at: "2024-11-08T20:30:00Z", marks: 18, remarks: "Excellent work. Clean diagram with proper notation.", graded_by: "mentor-001", graded_at: "2024-11-12T10:00:00Z", status: "Graded" },
  { id: "sub-002", assignment_id: "asgn-001", student_id: "student-002", file_url: "/files/sub-meghana-er.pdf", submitted_at: "2024-11-09T15:00:00Z", marks: 16, remarks: "Good effort. Missing some cardinality constraints.", graded_by: "mentor-001", graded_at: "2024-11-12T10:30:00Z", status: "Graded" },
  { id: "sub-003", assignment_id: "asgn-002", student_id: "student-001", file_url: "/files/sub-aditya-sql.pdf", submitted_at: "2024-11-19T22:00:00Z", status: "Submitted" },
];

// ── Feed Posts ──
export const mockFeed: FeedPost[] = [
  { id: "feed-001", title: "Campus Placement Drive — Infosys", content: "Infosys is visiting our campus on December 5, 2024. Eligible branches: CS, IS, EC. Minimum CGPA: 7.0. Register via the placement portal by November 28.", type: "Placement", posted_by: "admin-001", created_at: "2024-11-01T09:00:00Z", updated_at: "2024-11-01T09:00:00Z" },
  { id: "feed-002", title: "Hackathon Alert — CodeStorm 2024", content: "Annual inter-college hackathon CodeStorm is open for registrations. Theme: Sustainable Smart Cities. Register in teams of 3-4. Prizes worth ₹1,00,000.", type: "Hackathon", posted_by: "admin-001", created_at: "2024-10-28T10:00:00Z", updated_at: "2024-10-28T10:00:00Z" },
  { id: "feed-003", title: "Mid-Semester Exam Schedule Released", content: "Mid-semester examinations for all branches will be held from November 18-25. Timetable is available in the academic calendar section.", type: "Announcement", posted_by: "admin-001", created_at: "2024-10-25T08:00:00Z", updated_at: "2024-10-25T08:00:00Z" },
  { id: "feed-004", title: "IEEE Workshop — Introduction to IoT", content: "IEEE Student Branch is organizing a hands-on workshop on IoT using Raspberry Pi. Date: November 15. Venue: CS Lab 3. Limited to 40 seats.", type: "Event", posted_by: "admin-001", created_at: "2024-10-20T14:00:00Z", updated_at: "2024-10-20T14:00:00Z" },
  { id: "feed-005", title: "Cultural Fest — Sahyadri Utsav 2024", content: "Annual cultural fest dates announced: December 12-14. Registrations for competitions open now. Categories: Music, Dance, Drama, Literary, Art.", type: "Event", target_year: 0, posted_by: "admin-001", created_at: "2024-10-15T09:00:00Z", updated_at: "2024-10-15T09:00:00Z" },
];

// ── Notifications ──
export const mockNotifications: Notification[] = [
  { id: "notif-001", user_id: "student-001", title: "Assignment Due Tomorrow", message: "SQL Queries Lab assignment is due on November 20.", category: "Academic", is_read: false, link: "/student/assignments", created_at: "2024-11-19T08:00:00Z" },
  { id: "notif-002", user_id: "student-001", title: "Achievement Verified!", message: "Your AWS Certified Cloud Practitioner certificate has been verified by Dr. Priya Shetty.", category: "Achievement", is_read: false, link: "/student/achievements", created_at: "2024-11-15T10:00:00Z" },
  { id: "notif-003", user_id: "student-001", title: "Mentor Session Logged", message: "Dr. Priya Shetty has logged a new interaction session (Career). Please acknowledge.", category: "Mentorship", is_read: true, link: "/student/mentorship", created_at: "2024-11-01T12:00:00Z" },
  { id: "notif-004", user_id: "student-001", title: "New Study Material", message: "Module 3 — Normalization has been uploaded for DBMS.", category: "Academic", is_read: true, link: "/student/materials", created_at: "2024-09-01T10:00:00Z" },
  { id: "notif-005", user_id: "student-005", title: "⚠️ Low Attendance Warning", message: "Your attendance in Operating Systems is 68%. It must be above 75% to be eligible for exams.", category: "Academic", is_read: false, link: "/student/academics/attendance", created_at: "2024-11-05T09:00:00Z" },
];

// ── Grace Requests ──
export const mockGraceRequests: GraceRequest[] = [
  {
    id: "grace-001", student_id: "student-001", reason: "Was unwell with viral fever. Doctor advised 3 days rest.",
    reason_type: "Medical", document_url: "/files/medical-cert.pdf",
    status: "Approved", mentor_remarks: "Verified medical certificate. Approved.",
    reviewed_by: "mentor-001", date_from: "2024-10-01", date_to: "2024-10-03",
    subject_name: "DBMS",
    created_at: "2024-10-04T10:00:00Z", updated_at: "2024-10-05T14:00:00Z",
  },
  {
    id: "grace-002", student_id: "student-005", reason: "Participated in VTU inter-college sports meet.",
    reason_type: "Event", document_url: "/files/sports-certificate.pdf",
    status: "Pending", date_from: "2024-11-01", date_to: "2024-11-03",
    subject_name: "Operating Systems",
    created_at: "2024-11-04T10:00:00Z", updated_at: "2024-11-04T10:00:00Z",
  },
];

// ── Academic Calendar ──
export const mockCalendar: CalendarEvent[] = [
  { id: "cal-001", title: "Mid-Semester Examinations", type: "Exam", date: "2024-11-18", end_date: "2024-11-25", academic_year: "2024-25", created_at: "2024-10-01T00:00:00Z" },
  { id: "cal-002", title: "Diwali Vacation", type: "Holiday", date: "2024-11-01", end_date: "2024-11-05", academic_year: "2024-25", created_at: "2024-10-01T00:00:00Z" },
  { id: "cal-003", title: "End-Semester Examinations", type: "Exam", date: "2025-01-06", end_date: "2025-01-20", academic_year: "2024-25", created_at: "2024-10-01T00:00:00Z" },
  { id: "cal-004", title: "Achievement Submission Window", type: "Submission", date: "2024-11-01", end_date: "2024-12-15", academic_year: "2024-25", created_at: "2024-10-01T00:00:00Z" },
  { id: "cal-005", title: "Christmas & New Year Break", type: "Holiday", date: "2024-12-23", end_date: "2025-01-01", academic_year: "2024-25", created_at: "2024-10-01T00:00:00Z" },
];

// ── Attendance Records (sample) ──
export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: "att-001", student_id: "student-001", subject_name: "DBMS", subject_code: "21CS51", date: "2024-10-01", status: "Present", marked_by: "mentor-001", semester: 5, academic_year: "2024-25", created_at: "2024-10-01T00:00:00Z" },
  { id: "att-002", student_id: "student-001", subject_name: "DBMS", subject_code: "21CS51", date: "2024-10-02", status: "Present", marked_by: "mentor-001", semester: 5, academic_year: "2024-25", created_at: "2024-10-02T00:00:00Z" },
  { id: "att-003", student_id: "student-001", subject_name: "DBMS", subject_code: "21CS51", date: "2024-10-03", status: "Absent", marked_by: "mentor-001", semester: 5, academic_year: "2024-25", created_at: "2024-10-03T00:00:00Z" },
  { id: "att-004", student_id: "student-001", subject_name: "Computer Networks", subject_code: "21CS52", date: "2024-10-01", status: "Present", marked_by: "mentor-001", semester: 5, academic_year: "2024-25", created_at: "2024-10-01T00:00:00Z" },
  { id: "att-005", student_id: "student-001", subject_name: "Computer Networks", subject_code: "21CS52", date: "2024-10-02", status: "Late", marked_by: "mentor-001", semester: 5, academic_year: "2024-25", created_at: "2024-10-02T00:00:00Z" },
];

// ── Schedule (for dashboard) ──
export const mockSchedule: ScheduleItem[] = [
  { id: "sched-001", time: "09:00", endTime: "10:00", subject: "Database Management Systems", room: "CS Lab 2", faculty: "Dr. Priya Shetty", isCurrent: false },
  { id: "sched-002", time: "10:15", endTime: "11:15", subject: "Computer Networks", room: "Room 302", faculty: "Dr. Priya Shetty", isCurrent: true },
  { id: "sched-003", time: "11:30", endTime: "12:30", subject: "Operating Systems", room: "Room 205", faculty: "Prof. Raghavendra Rao" },
  { id: "sched-004", time: "14:00", endTime: "15:00", subject: "Machine Learning", room: "CS Lab 1", faculty: "Dr. Priya Shetty" },
  { id: "sched-005", time: "15:15", endTime: "16:15", subject: "Software Engineering", room: "Room 310", faculty: "Prof. Suresh Kumar" },
];

// ── Academic Health (for dashboard) ──
export const mockAcademicHealth: AcademicHealth = {
  cgpa: 8.8,
  attendance: 82,
  semesterGpas: [
    { semester: 1, gpa: 8.5 },
    { semester: 2, gpa: 8.8 },
    { semester: 3, gpa: 9.1 },
    { semester: 4, gpa: 8.6 },
    { semester: 5, gpa: 9.0 },
  ],
  healthStatus: "good",
};

// ── Pending Actions (for dashboard) ──
export const mockPendingActions: PendingAction[] = [
  { id: "pa-001", type: "assignment", title: "SQL Queries Lab — Due Nov 20", dueDate: "2024-11-20", priority: "high" },
  { id: "pa-002", type: "mentorship", title: "Acknowledge mentor session (Oct 20)", priority: "medium" },
  { id: "pa-003", type: "achievement", title: "Pending: Inter-College Coding Contest", priority: "low" },
  { id: "pa-004", type: "grace", title: "Grace request verification pending", priority: "medium" },
];

// ── Attendance Summary per subject (for dashboard) ──
export const mockAttendanceSummary = [
  { subject: "DBMS", code: "21CS51", total: 42, present: 36, percentage: 85.7 },
  { subject: "Computer Networks", code: "21CS52", total: 40, present: 33, percentage: 82.5 },
  { subject: "Operating Systems", code: "21CS53", total: 38, present: 30, percentage: 78.9 },
  { subject: "Machine Learning", code: "21CS61", total: 35, present: 29, percentage: 82.8 },
  { subject: "Software Engineering", code: "21CS54", total: 36, present: 28, percentage: 77.8 },
];

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
