import { supabase } from './supabase';
import * as mockData from './mock-data';
import { Profile, Grade, Interaction, GraceRequest, Achievement, CourseEnrollment, Assignment, Submission, FeedPost, Notification } from './types';

// Toggle this environment variable when Supabase is ready
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

// Temporary auth state (since we aren't using Supabase Auth yet for the demo)
let currentUser: Profile | null = null;

export const auth = {
  async signIn(email: string): Promise<Profile | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
      if (error) {
        console.error("Supabase signIn error:", error);
      }
      if (data) currentUser = data as Profile;
      return data as Profile | null;
    }
    const user = mockData.mockProfiles.find(p => p.email === email);
    if (user) currentUser = user;
    return user || null;
  },
  getCurrentUser(): Profile | null {
    if (USE_SUPABASE) return currentUser;
    return currentUser || mockData.currentStudentUser; // Fallback for dev
  }
};

export const dataService = {
  async getStudentGrades(studentId: string): Promise<Grade[]> {
    if (USE_SUPABASE) {
      const { data } = await supabase.from('grades').select('*').eq('student_id', studentId);
      return data as Grade[] || [];
    }
    return mockData.mockGrades.filter((g) => g.student_id === studentId);
  },

  async getStudentInteractions(studentId: string): Promise<Interaction[]> {
    if (USE_SUPABASE) {
      const { data } = await supabase.from('interactions').select('*').eq('mentee_id', studentId).order('date', { ascending: false });
      return data as Interaction[] || [];
    }
    return mockData.mockInteractions
      .filter((i) => i.mentee_id === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getStudentGraceRequests(studentId: string): Promise<GraceRequest[]> {
    if (USE_SUPABASE) {
      const { data } = await supabase.from('grace_requests').select('*').eq('student_id', studentId);
      return data as GraceRequest[] || [];
    }
    return mockData.mockGraceRequests.filter((r) => r.student_id === studentId);
  },

  async getStudentAchievements(studentId: string): Promise<Achievement[]> {
    if (USE_SUPABASE) {
      const { data } = await supabase.from('achievements').select('*').eq('student_id', studentId);
      return data as Achievement[] || [];
    }
    return mockData.mockAchievements.filter((a) => a.student_id === studentId);
  },

  async getMentorMentees(mentorId: string): Promise<Profile[]> {
    if (USE_SUPABASE) {
      const { data: allocations } = await supabase.from('allocations').select('mentee_id').eq('mentor_id', mentorId).eq('is_active', true);
      if (!allocations || allocations.length === 0) return [];
      const menteeIds = allocations.map(a => a.mentee_id);
      const { data: mentees } = await supabase.from('profiles').select('*').in('id', menteeIds);
      return mentees as Profile[] || [];
    }
    return mockData.getMenteesForMentor(mentorId);
  },

  async getMentorInteractions(mentorId: string): Promise<Interaction[]> {
    if (USE_SUPABASE) {
      const { data } = await supabase.from('interactions').select('*').eq('mentor_id', mentorId).order('date', { ascending: false });
      return data as Interaction[] || [];
    }
    return mockData.mockInteractions.filter(i => i.mentor_id === mentorId);
  },

  async getFeedPosts(): Promise<FeedPost[]> {
    if (USE_SUPABASE) {
      const { data } = await supabase.from('feed_posts').select('*').order('created_at', { ascending: false });
      return data as FeedPost[] || [];
    }
    return mockData.mockFeed;
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    if (USE_SUPABASE) {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      return data as Notification[] || [];
    }
    return mockData.mockNotifications.filter(n => n.user_id === userId);
  }
};
