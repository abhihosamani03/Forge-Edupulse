-- Run this in your Supabase SQL Editor to allow the prototype frontend to read your data.
-- Since the frontend uses the "anon" key and we haven't wired up Supabase Auth yet, 
-- it needs permission to read the profiles and other tables.

-- Create policies to allow public reads (Warning: only for prototype/development)
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to allocations" ON public.allocations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to interactions" ON public.interactions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to grades" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Allow public read access to attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public read access to grace_requests" ON public.grace_requests FOR SELECT USING (true);
CREATE POLICY "Allow public read access to achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access to course_enrollments" ON public.course_enrollments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to course_materials" ON public.course_materials FOR SELECT USING (true);
CREATE POLICY "Allow public read access to assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to feed_posts" ON public.feed_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access to calendar_events" ON public.calendar_events FOR SELECT USING (true);
