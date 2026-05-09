-- ==========================================
-- EduPulse Supabase Database Schema
-- ==========================================

-- 1. Profiles (Users)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'mentor', 'mentee')),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    department TEXT,
    year INTEGER,
    section TEXT,
    usn TEXT UNIQUE,
    employee_id TEXT UNIQUE,
    designation TEXT,
    phone TEXT,
    address TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    year_of_joining INTEGER,
    is_profile_complete BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Allocations
CREATE TABLE public.allocations (
    id TEXT PRIMARY KEY,
    mentor_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentee_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(mentor_id, mentee_id)
);

-- 3. Interactions
CREATE TABLE public.interactions (
    id TEXT PRIMARY KEY,
    mentor_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentee_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    duration_minutes INTEGER,
    type TEXT CHECK (type IN ('Academic', 'Career', 'Personal', 'General')),
    topics TEXT,
    remarks TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    next_interaction_date DATE,
    mode TEXT CHECK (mode IN ('In-Person', 'Online')),
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    is_follow_up_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Grades
CREATE TABLE public.grades (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    subject_name TEXT NOT NULL,
    subject_code TEXT,
    internal_marks INTEGER,
    external_marks INTEGER,
    total_marks INTEGER,
    grade_letter TEXT,
    credits INTEGER,
    grade_points INTEGER,
    sgpa NUMERIC(4,2),
    cgpa NUMERIC(4,2),
    backlogs INTEGER DEFAULT 0,
    academic_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Attendance Records
CREATE TABLE public.attendance_records (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    subject_code TEXT,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Late')),
    marked_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    semester INTEGER,
    academic_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Grace Requests
CREATE TABLE public.grace_requests (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    reason_type TEXT CHECK (reason_type IN ('Medical', 'Event', 'Other')),
    document_url TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Forwarded')),
    mentor_remarks TEXT,
    admin_remarks TEXT,
    reviewed_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    date_from DATE,
    date_to DATE,
    subject_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Achievements
CREATE TABLE public.achievements (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('Hackathon', 'Internship', 'Certification', 'Paper Publication', 'Patent', 'Workshop', 'Conference', 'Sports', 'NSS/NCC', 'Other')),
    issuing_body TEXT,
    date DATE,
    level TEXT CHECK (level IN ('International', 'National', 'State', 'College')),
    description TEXT,
    file_url TEXT,
    nba_points INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
    rejection_reason TEXT,
    verified_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Courses
CREATE TABLE public.courses (
    id TEXT PRIMARY KEY,
    faculty_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    semester INTEGER,
    department TEXT,
    academic_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Course Enrollments
CREATE TABLE public.course_enrollments (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Dropped', 'Completed')),
    UNIQUE(student_id, course_id)
);

-- 10. Course Materials
CREATE TABLE public.course_materials (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Assignments
CREATE TABLE public.assignments (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    max_marks INTEGER,
    file_url TEXT,
    created_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Submissions
CREATE TABLE public.submissions (
    id TEXT PRIMARY KEY,
    assignment_id TEXT REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    marks INTEGER,
    remarks TEXT,
    graded_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Graded', 'Late')),
    UNIQUE(assignment_id, student_id)
);

-- 13. Feed Posts
CREATE TABLE public.feed_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT CHECK (type IN ('Announcement', 'Placement', 'Event', 'Hackathon', 'Club', 'Other')),
    target_department TEXT,
    target_year INTEGER,
    posted_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Notifications
CREATE TABLE public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    category TEXT CHECK (category IN ('Academic', 'Mentorship', 'Achievement', 'System')),
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Calendar Events
CREATE TABLE public.calendar_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('Exam', 'Holiday', 'Event', 'Submission', 'Other')),
    date DATE NOT NULL,
    end_date DATE,
    department TEXT,
    academic_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Enable RLS for all tables (Optional for initial setup but recommended)

-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
-- ...

-- For initial prototyping, you can keep RLS disabled or write policies that allow authenticated access:
-- CREATE POLICY "Allow all read access" ON public.profiles FOR SELECT USING (true);
