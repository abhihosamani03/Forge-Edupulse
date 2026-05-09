-- ==========================================
-- EduPulse Supabase Seed Data
-- Generated from: Data Engineering and AI - Actual Program.xlsx (Sheet: n8n links)
-- ==========================================

-- 1. Remove old demo/stale student data (if any)
DELETE FROM public.profiles WHERE id = 'student-001' AND usn = '4SH21CS001';
DELETE FROM public.profiles WHERE id LIKE 'xl-student-%';

-- 2. Core Staff Profiles (admin + mentors only)
INSERT INTO public.profiles (id, role, full_name, email, department, year, section, usn, employee_id, designation, is_profile_complete, is_active) VALUES
('admin-001', 'admin', 'Dr. Manjunath Kotari', 'admin@sahyadri.edu.in', 'Administration', NULL, NULL, NULL, 'SAH-ADM-001', 'Principal', true, true),
('mentor-001', 'mentor', 'Dr. Priya Shetty', 'priya.shetty@sahyadri.edu.in', 'Computer Science', NULL, NULL, NULL, 'SAH-CS-042', 'Associate Professor', true, true),
('mentor-002', 'mentor', 'Prof. Ramesh Kumar', 'ramesh.kumar@sahyadri.edu.in', 'Computer Science', NULL, NULL, NULL, 'SAH-CS-043', 'Assistant Professor', true, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Student Profiles from n8n spreadsheet (66 students)
INSERT INTO public.profiles (id, role, full_name, email, department, year, section, usn, employee_id, designation, is_profile_complete, is_active) VALUES
('student-001', 'mentee', 'ABHISHEK', 'abhihosamani1967@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI005', NULL, NULL, true, true),
('student-002', 'mentee', 'Adhithi Gatty', 'adhithigatty0@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI007', NULL, NULL, true, true),
('student-003', 'mentee', 'AFIFA PARVEEN', 'afifaparveen3690@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI010', NULL, NULL, true, true),
('student-004', 'mentee', 'AHANI SHETTY', 'ahanishetty3@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI012', NULL, NULL, true, true),
('student-005', 'mentee', 'AKANKSHA VINOD VARDHAMANE', 'akankshavardhamane@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI013', NULL, NULL, true, true),
('student-006', 'mentee', 'AKASH M ACHARYA', 'akashmacharya2010053@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI016', NULL, NULL, true, true),
('student-007', 'mentee', 'AKHILESH', 'akhileshkulal135@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI017', NULL, NULL, true, true),
('student-008', 'mentee', 'ALFAN YASEEN SHAIKH', 'alfanshaikh902@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI018', NULL, NULL, true, true),
('student-009', 'mentee', 'AMARNATH SINGH', 'amarnathsingh10122006@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI020', NULL, NULL, true, true),
('student-010', 'mentee', 'AMRUTHA SOMASHEKAR SHETTY', 'amruthasomashekarshetty@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI021', NULL, NULL, true, true),
('student-011', 'mentee', 'Ananya Mahalatkar S', 'ananyamahalatkarrs@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI023', NULL, NULL, true, true),
('student-012', 'mentee', 'BOOMIKA SRIRAJ', 'boomikaganiga@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI040', NULL, NULL, true, true),
('student-013', 'mentee', 'C VIKAS RAJU', 'vikasrajuc15@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI041', NULL, NULL, true, true),
('student-014', 'mentee', 'Chaitrika', 'chaitrikat.2020@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI042', NULL, NULL, true, true),
('student-015', 'mentee', 'CHAMAN CHANDRAGIRI HOUSE', 'chamanch2006@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI043', NULL, NULL, true, true),
('student-016', 'mentee', 'Charishma R Rai', 'charishmarrrai@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI044', NULL, NULL, true, true),
('student-017', 'mentee', 'CHASHMITHA D C', 'chashdc02@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI045', NULL, NULL, true, true),
('student-018', 'mentee', 'CHINTHAN', 'chinthanrganiga@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI046', NULL, NULL, true, true),
('student-019', 'mentee', 'DEEKSHA G R', 'gdeeksha888@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI049', NULL, NULL, true, true),
('student-020', 'mentee', 'DHANUSH P SHETTY', 'dhanushpshetty40@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI052', NULL, NULL, true, true),
('student-021', 'mentee', 'FATHIMA', 'fathimahabeeb7890@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI053', NULL, NULL, true, true),
('student-022', 'mentee', 'HARSHITHA', 'harshik997@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI060', NULL, NULL, true, true),
('student-023', 'mentee', 'JANITH BOPANNA A M', 'janithbopanna@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI063', NULL, NULL, true, true),
('student-024', 'mentee', 'JEEVAN K SALIAN', 'jeevansalian26@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI065', NULL, NULL, true, true),
('student-025', 'mentee', 'KAVYA S N', 'kavyasn707@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI069', NULL, NULL, true, true),
('student-026', 'mentee', 'KSHETHRA B J', 'kshethrabj79@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI073', NULL, NULL, true, true),
('student-027', 'mentee', 'MEDHA KODIALBAIL', 'medha24kodialbail@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI082', NULL, NULL, true, true),
('student-028', 'mentee', 'Mitra', 'kulalmitra@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI085', NULL, NULL, true, true),
('student-029', 'mentee', 'Mohammed Ihaab Ibrahim', 'ihaab998@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI092', NULL, NULL, true, true),
('student-030', 'mentee', 'MOHAMMED ZISHAAN', 'mohammedzishaan386@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI095', NULL, NULL, true, true),
('student-031', 'mentee', 'MOIDIN FAARISH AHMED', 'farishahmed266@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI096', NULL, NULL, true, true),
('student-032', 'mentee', 'NISHCHAL BHANDARI', 'nishchalbhandari18@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI107', NULL, NULL, true, true),
('student-033', 'mentee', 'NUHA MARIAM', 'nuha2837@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI109', NULL, NULL, true, true),
('student-034', 'mentee', 'PAVAN', 'kulalpavan338@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI115', NULL, NULL, true, true),
('student-035', 'mentee', 'PAVAN RAI K', 'kusumaraikb8@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI119', NULL, NULL, true, true),
('student-036', 'mentee', 'PRANAV K  K', 'pranavk10506@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI123', NULL, NULL, true, true),
('student-037', 'mentee', 'Preksha', 'prekshashettys79@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI128', NULL, NULL, true, true),
('student-038', 'mentee', 'PUNITH KUMAR', 'srinivass64350@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI130', NULL, NULL, true, true),
('student-039', 'mentee', 'RAKSHITA K', 'rakshita13092006@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI131', NULL, NULL, true, true),
('student-040', 'mentee', 'REHAN PATEL', 'rehanpatel2194@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI132', NULL, NULL, true, true),
('student-041', 'mentee', 'RIHAA FATHIMA', 'rihaafathima69@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI133', NULL, NULL, true, true),
('student-042', 'mentee', 'SAGARA S K  S K', 'ss3185531@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI135', NULL, NULL, true, true),
('student-043', 'mentee', 'SAISMITHA M N', 'saismithamanibettu@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI136', NULL, NULL, true, true),
('student-044', 'mentee', 'SAMARTH BHAT', 'bhatsamarth98450@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI138', NULL, NULL, true, true),
('student-045', 'mentee', 'SAMEEKSHA SANTOSH NAIK', 'naiksameeksha1919@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI139', NULL, NULL, true, true),
('student-046', 'mentee', 'SAMRUDHI', 'samruddhishetty54@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI140', NULL, NULL, true, true),
('student-047', 'mentee', 'SANVITH S RAI', 'sanvithsrai9@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI147', NULL, NULL, true, true),
('student-048', 'mentee', 'SHIVANI RAMAKRISHNA NAIK', 'naikshivani34@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI159', NULL, NULL, true, true),
('student-049', 'mentee', 'SHREELAKSHMI', 'shrilaxmishettyshrilaxmi@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI163', NULL, NULL, true, true),
('student-050', 'mentee', 'SHREYA N SHETTY', 'shreyanshetty74@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI164', NULL, NULL, true, true),
('student-051', 'mentee', 'SHREYAS D BANGERA', 'shreyasdbangeraa@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI165', NULL, NULL, true, true),
('student-052', 'mentee', 'SHREYAS J NAYAK', 'shreyasjnayak@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI166', NULL, NULL, true, true),
('student-053', 'mentee', 'SHRUTHI K K', 'shruthikk58@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI168', NULL, NULL, true, true),
('student-054', 'mentee', 'THARUN RAI', 'raitharun568@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI176', NULL, NULL, true, true),
('student-055', 'mentee', 'THRUSHA Y K', 'ykthrusha@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI177', NULL, NULL, true, true),
('student-056', 'mentee', 'V KEERTHANA', 'keerthanavalkamdinni@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI178', NULL, NULL, true, true),
('student-057', 'mentee', 'V NAVAKRUTHIKA', 'navakruthikavajravel@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI179', NULL, NULL, true, true),
('student-058', 'mentee', 'VAISHAL N V', 'vaishalnv819@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI180', NULL, NULL, true, true),
('student-059', 'mentee', 'VIKAS THARANATH SHETTIGAR THARANATH SHETTIGAR', 'vikasshettigar11@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI185', NULL, NULL, true, true),
('student-060', 'mentee', 'YASHVIN', 'yashvin9911@gmail.com', 'Computer Science & Information Science', 1, NULL, '4SF24CI186', NULL, NULL, true, true),
('student-061', 'mentee', 'B Sneha Shenoy', 'bsnehashenoy@gmail.com', 'Computer Science & Information Science', 1, NULL, NULL, NULL, NULL, true, true),
('student-062', 'mentee', 'Pratiksha V Poojary', 'prathikshavpoojary6@gmail.com', 'Computer Science & Information Science', 1, NULL, NULL, NULL, NULL, true, true),
('student-063', 'mentee', 'S Saveen Rai', 'saveenraimanglore@gmail.com', 'Computer Science & Information Science', 1, NULL, NULL, NULL, NULL, true, true),
('student-064', 'mentee', 'PRANAV', 'pranavpavan641@gmail.com', 'Computer Science & Information Science', 1, NULL, NULL, NULL, NULL, true, true),
('student-065', 'mentee', 'Shraddha JS', 'Shraddhaacharya051@gmail.com', 'Computer Science & Information Science', 1, NULL, NULL, NULL, NULL, true, true),
('student-066', 'mentee', 'Nidhi H V', 'nidhiharish99@gmail.com', 'Computer Science & Information Science', 1, NULL, NULL, NULL, NULL, true, true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  usn = EXCLUDED.usn,
  department = EXCLUDED.department;
