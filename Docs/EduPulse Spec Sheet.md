**PRODUCT SPEC SHEET**
**EduPulse**

Unified College Ecosystem — LMS, SIS, Mentorship & Achievement Tracker

Prepared for: Sahyadri College of Engineering & Management, Mangalore

Author: Abhishek Hosamani

Organization: Sahyadri College of Engineering & Management

Date: May 2026

Version: 1.0

# **1. Product Overview**

## **1.1 Product Name & Description**

| Field | Detail |
| :---- | :---- |
| Product Name | EduPulse |
| One-line Description | A unified college ecosystem application merging LMS, SIS, achievement tracking, mentorship portal, and AI-powered attendance management for engineering colleges |
| Product Type | Internal institutional platform / Web application |
| Version | 1.0 (MVP / Demo Build) |

## **1.2 Problem Statement**

Engineering colleges manage student data, attendance, mentorship, achievements, and course materials across disconnected systems — spreadsheets, separate portals, WhatsApp groups, and manual paper registers. This creates four specific problems:

* **Fragmented student data:** Academic records, attendance, achievements, and mentorship interactions are tracked in separate systems with no unified view. Faculty cannot see a student's complete academic health at a glance.

* **Manual attendance processing:** Attendance data from bulk spreadsheets (Google Sheets exports) requires manual cleanup, format conversion, and database entry. Column headers vary between sheets, date formats are inconsistent, and student identifiers don't always match database records.

* **No mentorship tracking:** Mentor-mentee interactions, follow-ups, and academic health monitoring happen informally with no audit trail. There is no system to track which students have been assigned to which mentors, or whether follow-up actions were completed.

* **Achievement verification bottleneck:** Students submit achievements (hackathons, certifications, internships) for NBA accreditation points, but verification is a manual process with no status tracking, no document management, and no consolidated score calculation.

## **1.3 Target Users**

**Administrator (Admin):** The Principal or HOD who needs a platform-wide overview — total students, faculty, mentorship allocations, pending verifications, department-level analytics, and system audit logs. Full CRUD access to all data.

**Faculty / Mentor:** Professors assigned as mentors who need to track their mentees' academic health, mark/upload attendance, verify student achievements, log interaction sessions, process grace requests, and manage course materials. Full CRUD access to their own mentees' data.

**Student (Mentee):** Enrolled students who need read-only access to their own academic records — grades, attendance summary, achievement status, mentor interaction history, course materials, campus feed, and academic calendar. Students cannot view other students' data or modify records.

This requires three distinct roles: `admin`, `mentor`, and `mentee`. Authentication is required.

# **2. Core Features**

## **2.1 Feature List**

| # | Feature | Priority | Description |
| :---- | :---- | :---- | :---- |
| F1 | Role-Based Dashboards | Must Have | Tailored Bento-grid dashboards for each role showing contextual stats, pending actions, and quick-access cards. |
| F2 | AI-Powered Attendance Upload | Must Have | Upload an Excel/CSV spreadsheet. An AI agent (Gemini) reads the file, detects column mapping (handles pivoted layouts, inconsistent headers, TRUE/FALSE checkboxes), validates data, shows a preview, and on confirmation writes cleaned records to the database. |
| F3 | Mentor-Mentee Management | Must Have | Assign students to mentors via bulk upload or admin allocations page. Mentors see their mentee list with academic health indicators. |
| F4 | Achievement Workflow | Must Have | Students submit achievements (hackathons, certifications, internships) with category, level, and supporting documents. Mentors verify/reject with remarks. Verified achievements auto-calculate NBA accreditation points. |
| F5 | Grace Request System | Should Have | Students submit attendance grace requests with reason type (Medical, Event, Other) and supporting documents. Mentors review and approve/reject/forward to admin. |
| F6 | Course & Material Management | Should Have | Faculty create courses, upload materials (slides, documents), create assignments with deadlines, and grade student submissions. |
| F7 | Campus Feed | Should Have | Global announcement board with post types (Announcement, Placement, Event, Hackathon, Club) filterable by department and year. |
| F8 | Academic Calendar | Should Have | Institution-wide calendar showing exams, holidays, events, and submission deadlines. |
| F9 | Notifications | Should Have | Per-user notification system categorized by Academic, Mentorship, Achievement, and System events. |
| F10 | Authentication & RBAC | Must Have | Login system with three roles (admin, mentor, mentee). Role determines navigation, accessible routes, and data scope. Demo mode with pre-filled credentials. |

## **2.2 Feature F2 Deep Dive: AI-Powered Attendance Upload**

**This is the most complex feature. The upload pipeline uses Google Gemini to handle messy, real-world spreadsheet data from The Forge bootcamp program.**

### **2.2.1 Why an AI Agent for Attendance Import?**

Attendance spreadsheets from the program are not standardized. The primary format is a Google Sheets export where dates are column headers and attendance is recorded as checkbox values (TRUE/FALSE). Specific variations include:

* Pivoted layout: dates like '30/04/26', '18/02/26' are column headers, not a single 'date' column — the agent must detect this
* Google Sheets checkbox values: TRUE/FALSE instead of P/A or Present/Absent
* DD/MM/YY date format in headers — not standard ISO format
* Excel serial date numbers (integers like 46238) that need conversion
* Extra columns not needed: SL No, email, n8n invite link, admission\_number, assessment scores — must be mapped to IGNORE
* Score columns (Knowledge, Skill, Total Scores) that look numeric but are NOT attendance
* Empty cells where a student wasn't enrolled — these are not 'Absent', they mean 'no record'
* Blank rows or summary rows from Google Sheets export

### **2.2.2 Upload Pipeline: Step by Step**

**Step 1: File Upload**
* User drags/drops or browses for a .xlsx, .xls, or .csv file
* Client-side parsing via SheetJS (XLSX) library — converts to workbook object
* Display: filename, detected sheet names, user selects which sheet to process

**Step 2: Configure**
* User enters the Subject/Course Name (groups records in the database)
* User selects which sheet tab from the workbook to analyse
* Click "Analyse with AI" to proceed

**Step 3: AI Agent Column Mapping**
* Headers and first 2 sample rows are sent to the server-side API route (`/api/ai/attendance`)
* The API calls Google Gemini (gemini-2.5-flash) with a detailed system prompt
* Agent returns structured JSON identifying: student identifier column (prefers USN, falls back to email/name), attendance columns with inferred dates, and columns to IGNORE
* **Double validation:** Server-side filtering removes known non-attendance headers (scores, URLs, metadata). Client-side filtering further excludes columns with URL data or large numbers.
* The mapping is displayed for user review — each column shows whether the date was auto-resolved or needs manual input

**Step 4: Review & Manual Date Entry**
* User reviews AI mapping results
* For columns where dates couldn't be auto-detected, user provides dates via date picker
* All dates must be resolved before upload can proceed

**Step 5: Database Sync**
* Duplicate check: queries existing attendance\_records for matching subject + dates
* If duplicates found: shows warning with option to proceed (upsert) or go back
* Student matching: builds lookup map from profiles table (USN, email, full\_name → profile ID)
* Records are deduplicated (same student + subject + date) and batch-upserted in chunks of 500
* Progress bar shows completion percentage
* On success: prompts to optionally assign uploaded students as mentees to a selected mentor

# **3. Data Model**

The database schema consists of 15 tables hosted on Supabase PostgreSQL. All tables use TEXT IDs as primary keys.

## **3.1 Profiles Table**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | TEXT | PRIMARY KEY | Unique user identifier (e.g., 'student-001', 'mentor-001') |
| role | TEXT | NOT NULL, CHECK (admin/mentor/mentee) | Determines access level |
| full\_name | TEXT | NOT NULL | Display name |
| email | TEXT | UNIQUE, NOT NULL | Login/contact email |
| avatar\_url | TEXT | NULLABLE | Profile photo URL |
| department | TEXT | NULLABLE | Academic department |
| year | INTEGER | NULLABLE | Current academic year (students only) |
| section | TEXT | NULLABLE | Class section |
| usn | TEXT | UNIQUE | University Seat Number |
| employee\_id | TEXT | UNIQUE | Staff ID (faculty/admin only) |
| designation | TEXT | NULLABLE | Job title (faculty only) |
| phone | TEXT | NULLABLE | Contact number |
| address | TEXT | NULLABLE | Residential address |
| linkedin\_url | TEXT | NULLABLE | LinkedIn profile |
| github\_url | TEXT | NULLABLE | GitHub profile |
| year\_of\_joining | INTEGER | NULLABLE | Enrollment/hire year |
| is\_profile\_complete | BOOLEAN | DEFAULT false | Profile completion flag |
| is\_active | BOOLEAN | DEFAULT true | Active enrollment/employment |
| created\_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation |
| updated\_at | TIMESTAMPTZ | DEFAULT NOW() | Last modification |

## **3.2 Allocations Table**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | TEXT | PRIMARY KEY | Unique allocation ID |
| mentor\_id | TEXT | FK → profiles(id), ON DELETE CASCADE | Assigned mentor |
| mentee\_id | TEXT | FK → profiles(id), ON DELETE CASCADE | Assigned student |
| allocated\_at | TIMESTAMPTZ | DEFAULT NOW() | Assignment date |
| is\_active | BOOLEAN | DEFAULT true | Whether allocation is current |

**UNIQUE CONSTRAINT: (mentor\_id, mentee\_id) — prevents duplicate mentor-mentee pairs.**

## **3.3 Interactions Table**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | TEXT | PRIMARY KEY | Unique interaction ID |
| mentor\_id | TEXT | FK → profiles(id) | Mentor who conducted the session |
| mentee\_id | TEXT | FK → profiles(id) | Student in the session |
| date | DATE | NOT NULL | Session date |
| duration\_minutes | INTEGER | NULLABLE | Session length |
| type | TEXT | CHECK (Academic/Career/Personal/General) | Interaction category |
| topics | TEXT | NULLABLE | Discussion topics |
| remarks | TEXT | NULLABLE | Mentor's notes |
| follow\_up\_required | BOOLEAN | DEFAULT false | Whether follow-up is needed |
| follow\_up\_notes | TEXT | NULLABLE | Follow-up action items |
| next\_interaction\_date | DATE | NULLABLE | Scheduled next meeting |
| mode | TEXT | CHECK (In-Person/Online) | Meeting format |
| is\_acknowledged | BOOLEAN | DEFAULT false | Student acknowledgement |
| is\_follow\_up\_resolved | BOOLEAN | DEFAULT false | Follow-up completion |

## **3.4 Attendance Records Table**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | TEXT | PRIMARY KEY | Unique record ID |
| student\_id | TEXT | FK → profiles(id) | Student reference |
| subject\_name | TEXT | NOT NULL | Course/subject name |
| subject\_code | TEXT | NULLABLE | Subject code |
| date | DATE | NOT NULL | Attendance date |
| status | TEXT | CHECK (Present/Absent/Late) | Attendance status |
| marked\_by | TEXT | FK → profiles(id) | Who recorded it |
| semester | INTEGER | NULLABLE | Academic semester |
| academic\_year | TEXT | NULLABLE | Academic year |

## **3.5 Grades Table**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | TEXT | PRIMARY KEY | Unique grade record |
| student\_id | TEXT | FK → profiles(id) | Student reference |
| semester | INTEGER | NOT NULL | Semester number |
| subject\_name | TEXT | NOT NULL | Subject name |
| subject\_code | TEXT | NULLABLE | Subject code |
| internal\_marks | INTEGER | NULLABLE | Internal assessment marks |
| external\_marks | INTEGER | NULLABLE | External exam marks |
| total\_marks | INTEGER | NULLABLE | Combined marks |
| grade\_letter | TEXT | NULLABLE | Letter grade (A+, A, B+, etc.) |
| credits | INTEGER | NULLABLE | Subject credits |
| sgpa | NUMERIC(4,2) | NULLABLE | Semester GPA |
| cgpa | NUMERIC(4,2) | NULLABLE | Cumulative GPA |
| backlogs | INTEGER | DEFAULT 0 | Number of backlogs |

## **3.6 Grace Requests Table**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | TEXT | PRIMARY KEY | Unique request ID |
| student\_id | TEXT | FK → profiles(id) | Requesting student |
| reason | TEXT | NOT NULL | Detailed reason |
| reason\_type | TEXT | CHECK (Medical/Event/Other) | Category |
| document\_url | TEXT | NULLABLE | Supporting document |
| status | TEXT | DEFAULT 'Pending', CHECK (Pending/Approved/Rejected/Forwarded) | Current status |
| mentor\_remarks | TEXT | NULLABLE | Mentor's decision notes |
| admin\_remarks | TEXT | NULLABLE | Admin's decision notes |
| reviewed\_by | TEXT | FK → profiles(id) | Reviewing authority |
| date\_from | DATE | NULLABLE | Grace period start |
| date\_to | DATE | NULLABLE | Grace period end |
| subject\_name | TEXT | NULLABLE | Affected subject |

## **3.7 Achievements Table**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | TEXT | PRIMARY KEY | Unique achievement ID |
| student\_id | TEXT | FK → profiles(id) | Student who earned it |
| title | TEXT | NOT NULL | Achievement title |
| category | TEXT | CHECK (Hackathon/Internship/Certification/Paper Publication/Patent/Workshop/Conference/Sports/NSS-NCC/Other) | Type |
| issuing\_body | TEXT | NULLABLE | Issuing organization |
| date | DATE | NULLABLE | Achievement date |
| level | TEXT | CHECK (International/National/State/College) | Scope level |
| description | TEXT | NULLABLE | Details |
| file\_url | TEXT | NULLABLE | Certificate/proof document |
| nba\_points | INTEGER | DEFAULT 0 | NBA accreditation points awarded |
| status | TEXT | DEFAULT 'Pending', CHECK (Pending/Verified/Rejected) | Verification status |
| rejection\_reason | TEXT | NULLABLE | If rejected, why |
| verified\_by | TEXT | FK → profiles(id) | Verifying mentor |
| verified\_at | TIMESTAMPTZ | NULLABLE | Verification timestamp |

## **3.8 Additional Tables**

The schema also includes: **Courses** (faculty-created course records), **Course Enrollments** (student-course links with UNIQUE student+course), **Course Materials** (uploaded study resources), **Assignments** (with deadlines and max marks), **Submissions** (student work with grading, UNIQUE assignment+student), **Feed Posts** (campus announcements by type), **Notifications** (per-user alerts by category), and **Calendar Events** (institutional dates).

## **3.9 Entity Relationships**

* Profiles 1:N Allocations (one mentor has many mentee allocations)
* Profiles 1:N Attendance Records (one student has many attendance entries)
* Profiles 1:N Grades (one student has many grade records)
* Profiles 1:N Achievements (one student has many achievements)
* Profiles 1:N Interactions (via mentor\_id or mentee\_id)
* Profiles 1:N Grace Requests (one student submits many requests)
* Courses 1:N Course Materials, Assignments, Enrollments
* Assignments 1:N Submissions
* Allocations is the junction table between mentor and mentee Profiles (many-to-many)

## **3.10 Row Level Security (RLS)**

RLS is enabled on all tables. Current prototype configuration uses public read access policies for development:

* All tables: `SELECT` allowed for all authenticated/anonymous users (prototype-only)
* Write operations: handled at application level during prototype phase
* **Production target:** Students can only `SELECT` their own rows (WHERE student\_id = auth.uid()), mentors access their mentees' data, admins have full access

# **4. Tech Stack**

| Layer | Technology | Rationale |
| :---- | :---- | :---- |
| Framework | Next.js 14 (App Router) | Server-side rendering, file-based routing, API routes for AI backend |
| UI Library | React 18 | Component-based architecture, hooks for state management |
| Styling | Tailwind CSS 3.4 | Utility-first CSS with custom "Warm Slate" design system |
| Design System | Custom CSS tokens (globals.css) | Dark theme with warm accent colors, glassmorphism, micro-animations |
| Typography | Inter (body), Plus Jakarta Sans (headings), JetBrains Mono (code) | Premium, modern font stack via Google Fonts |
| Animations | Framer Motion 11 | Page transitions, step animations in upload wizard |
| Icons | Lucide React | Clean, consistent icon set |
| AI Agent | Google Gemini API (gemini-2.5-flash) | Fast inference, structured JSON output for column mapping |
| Spreadsheet Parsing | SheetJS (xlsx) | Client-side Excel/CSV parsing, handles .xlsx/.xls/.csv |
| Database | Supabase PostgreSQL | Managed Postgres with built-in Auth, RLS, REST API |
| Auth Client | @supabase/ssr + @supabase/supabase-js | Server and client Supabase clients with cookie-based session |
| Charts | Recharts | React-native charting for dashboard visualizations |
| Data Export | Custom CSV utility | Client-side CSV generation with BOM for Excel compatibility |
| State Management | React useState/useEffect | No external state library needed for current scope |

# **5. Design System: "Warm Slate"**

## **5.1 Color Tokens**

| Token | Value | Usage |
| :---- | :---- | :---- |
| --bg | #0F0F0F | Page background |
| --surface | #1A1A1A | Card/panel backgrounds |
| --surface-border | #2A2A2A | Borders, dividers |
| --accent | #E8A87C | Primary action color (warm peach) |
| --accent-hover | #D4956A | Hover state for primary actions |
| --secondary | #7C9E87 | Secondary actions (sage green) |
| --highlight | #C084FC | Tertiary/highlight (purple) |
| --text-primary | #F5F0EB | Main text (warm white) |
| --text-muted | #8A8A8A | Secondary text |
| --danger | #E07070 | Error/destructive states |
| --success | #6FCF97 | Success/positive states |

## **5.2 Component Library**

Pre-built CSS component classes: `.card`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.btn-icon`, `.input`, `.badge` (5 variants), `.data-table`, `.sidebar-link`, `.drop-zone`, `.toast` (4 variants), `.skeleton`, `.bento-grid`, `.drawer-overlay`, `.drawer-panel`, `.radial-progress`, `.status-dot` (4 variants).

# **6. Screen Specifications**

## **6.1 Login Screen**

* Centered form with Sahyadri College logo and EduPulse branding
* Three-tab role selector: Student Portal / Faculty Portal / Administrator
* Switching roles auto-fills demo credentials (email + password)
* On successful login: routes to `/student/dashboard`, `/mentor/dashboard`, or `/admin/dashboard`
* Background glow orbs for visual depth, animated fade-in

## **6.2 Student Dashboard**

* Bento-grid layout with Academic Health card (CGPA + attendance + semester GPA sparkline), NBA Score card, Pending Actions count, Today's Schedule (current class highlighted), Subject Attendance bars (color-coded: green ≥85%, yellow ≥75%, red <75%), Action Items (dismissible), Recent Announcements feed, and Achievements preview with status badges
* NBA Score card opens a modal showing verified achievement breakdown

## **6.3 Student Portal Pages**

* **Academics:** Grades table, attendance per subject, SGPA/CGPA display
* **Courses:** Enrolled courses, materials, assignments, submission status
* **Achievements:** Submit new achievements, view status (Pending/Verified/Rejected), NBA points
* **Mentorship:** View assigned mentor, interaction history, follow-up status
* **Feed:** Campus announcements filtered by type
* **Calendar:** Academic calendar with exam dates, holidays, events
* **Settings:** Profile information, contact details

## **6.4 Mentor/Faculty Dashboard**

* Summary cards: Mentees count, Pending Achievements, Grace Requests, My Courses
* Mentees overview table with academic health indicators, USN, NBA points
* Pending Actions panel: achievements to verify, grace requests, sessions to acknowledge
* Recent interaction sessions list

## **6.5 Mentor Portal Pages**

* **My Mentees:** Full mentee list from database (live Supabase query), academic health per student
* **Courses:** Manage course materials, create assignments, grade submissions
* **Attendance:** Manual attendance marking per subject
* **Bulk Upload:** AI-powered attendance upload wizard (see Feature F2)
* **Achievements:** Review and verify/reject student achievements
* **Reports:** Analytics and export capabilities
* **Settings:** Profile management

## **6.6 Admin Dashboard**

* Stats grid: Total Students, Faculty/Mentors, Active Allocations, Total NBA Points
* Alert cards for: Pending Achievement verifications, Grace Requests, Incomplete Profiles
* Students by Department breakdown with progress bars
* Recent Achievements activity feed
* Mentorship Allocations table (mentor → mentee count → interaction sessions)

## **6.7 Admin Portal Pages**

* **Users:** Manage all profiles (students, faculty, admin)
* **Courses:** Institutional course management
* **Allocations:** Mentor-mentee assignment management (live Supabase data)
* **Bulk Upload:** AI attendance upload (same component as mentor)
* **Achievements:** Platform-wide achievement oversight
* **Feed:** Manage campus announcements
* **Reports:** Institution-level analytics
* **Audit Log:** System activity tracking
* **Settings:** Platform configuration

## **6.8 Navigation: Role-Based**

**Student navigation:** Dashboard | Academics | Courses | Achievements | Mentorship | Feed | Calendar | Settings

**Mentor navigation:** Dashboard | My Mentees | Courses | Attendance | Bulk Upload | Achievements | Reports | Settings

**Admin navigation:** Dashboard | Users | Courses | Allocations | Bulk Upload | Achievements | Feed | Reports | Audit Log | Settings

Sidebar is collapsible on desktop (260px → 64px), slides in as overlay on mobile with hamburger menu trigger.

# **7. Data Architecture**

## **7.1 Dual Data Source Pattern**

EduPulse uses a toggle-based data architecture controlled by `NEXT_PUBLIC_USE_SUPABASE`:

* **When `true`:** All queries go to Supabase PostgreSQL via `@supabase/supabase-js`
* **When `false`:** Falls back to local mock data in `mock-data.ts` for offline development

The `data-service.ts` abstraction layer provides a unified API regardless of data source.

## **7.2 Supabase Client Architecture**

Three separate Supabase client configurations:

* **Browser client** (`lib/supabase.ts`): Singleton pattern using `createBrowserClient` for client components
* **Server client** (`lib/supabase/server.ts`): For server components and API routes
* **Middleware client** (`utils/supabase/middleware.ts`): For Next.js middleware with cookie handling

## **7.3 Seed Data**

Database is seeded with:
* 3 staff profiles (1 admin + 2 mentors)
* 66 real student profiles imported from program spreadsheet (names, emails, USNs from the Data Engineering and AI program at Sahyadri)
* All other data tables (allocations, interactions, grades, etc.) start empty — populated via the application

# **8. API Routes**

## **8.1 POST /api/ai/attendance**

Server-side API route that proxies requests to Google Gemini for attendance column mapping.

**Request body:** `{ headers: string[], sampleData: any[][] }`

**Processing:**
1. Validates GEMINI\_API\_KEY is set
2. Constructs detailed prompt with column headers and sample data
3. Calls `gemini-2.5-flash` with structured output instructions
4. Parses JSON response, applies server-side validation filters
5. Returns cleaned mapping

**Response:** `{ studentIdentifierColumn, studentIdentifierIndex, attendanceColumns[] }`

# **9. Constraints & Business Rules**

## **9.1 Data Integrity**

1. **Unique mentor-mentee pairs:** UNIQUE(mentor\_id, mentee\_id) on allocations table
2. **Unique course enrollments:** UNIQUE(student\_id, course\_id) on course\_enrollments
3. **Unique submissions:** UNIQUE(assignment\_id, student\_id) on submissions table
4. **USN uniqueness:** UNIQUE constraint on profiles.usn — no two students share a USN
5. **Email uniqueness:** UNIQUE constraint on profiles.email
6. **Employee ID uniqueness:** UNIQUE constraint on profiles.employee\_id
7. **Attendance deduplication:** Client-side dedup on (student\_id, subject\_name, date) before upsert
8. **Cascade deletes:** All FK references use ON DELETE CASCADE to maintain referential integrity

## **9.2 AI Upload Constraints**

1. **Accepted formats:** .xlsx, .xls, .csv only
2. **AI mapping must be user-confirmed:** Auto-detected mapping is always shown for review before import
3. **All dates must be resolved:** Upload button disabled until every attendance column has a valid date
4. **Duplicate detection:** Pre-upload check against existing records; user must explicitly acknowledge duplicates
5. **Batch upsert:** Records are upserted in chunks of 500 with `onConflict: "student_id,subject_name,date"`
6. **Unmatched students are skipped:** If a student identifier from the spreadsheet doesn't match any profile in the database, that row is skipped (with diagnostic error message showing sample unmatched values)

## **9.3 Role-Based Access**

1. **Three roles enforced:** admin, mentor, mentee — stored in profiles.role with CHECK constraint
2. **Navigation is role-scoped:** Each role sees only their navigation items
3. **Demo credentials are hardcoded:** For prototype only — student123, faculty123, admin123
4. **Login routes to role-specific dashboard:** mentee → /student/dashboard, mentor → /mentor/dashboard, admin → /admin/dashboard

# **10. Environment Configuration**

| Variable | Scope | Description |
| :---- | :---- | :---- |
| NEXT\_PUBLIC\_SUPABASE\_URL | Public | Supabase project URL |
| NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY | Public | Supabase anonymous/public key |
| NEXT\_PUBLIC\_SUPABASE\_PUBLISHABLE\_KEY | Public | Alias for anon key (backward compat) |
| SUPABASE\_SERVICE\_ROLE\_KEY | Server-only | Service role key for admin operations |
| DATABASE\_URL | Server-only | Direct PostgreSQL connection string |
| GEMINI\_API\_KEY | Server-only | Google Gemini API key for AI attendance mapping |
| NEXT\_PUBLIC\_USE\_SUPABASE | Public | Toggle: 'true' = live database, 'false' = mock data |

All environment variables are stored in `frontend/.env.local` which is gitignored. The `.gitignore` covers `.env`, `.env.*`, `*.pem`, `*.key`, `credentials.json`, and all test scripts.

# **11. Acceptance Criteria**

1. Login screen loads with three role tabs and pre-filled demo credentials
2. Switching roles auto-fills the correct email and password
3. Student dashboard shows Academic Health card with CGPA, attendance %, and semester GPA sparkline
4. Student can view achievements, courses, mentorship info, feed, and calendar — all read-only
5. Mentor dashboard shows mentee count, pending achievements, grace requests, and course count
6. Mentor can view live mentee list from Supabase (not mock data)
7. Admin dashboard shows platform-wide stats: total students, faculty, allocations, NBA points
8. Admin allocations page pulls live data from Supabase
9. AI attendance upload: .xlsx file can be uploaded, sheet selected, subject entered
10. AI correctly identifies student identifier column (USN preferred) and attendance date columns
11. AI correctly IGNOREs metadata columns (SL No, email, n8n links, assessment scores)
12. Score columns (Knowledge, Skill, Total) are excluded from attendance mapping
13. Excel serial date numbers are correctly converted to YYYY-MM-DD format
14. Manual date entry works for columns where AI couldn't detect the date
15. Duplicate detection warns before overwriting existing attendance records
16. Attendance records are batch-upserted to database with progress indicator
17. Post-upload mentor assignment prompt allows assigning uploaded students as mentees
18. Sidebar navigation collapses on desktop and slides in on mobile
19. "Warm Slate" design system renders correctly: dark background, warm accent colors, glassmorphism effects
20. No console errors, no unhandled promise rejections, no blank screens on any user flow
