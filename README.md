# EduPulse 🎓

EduPulse is a comprehensive, premium-grade college ecosystem application designed to unify Learning Management System (LMS), Student Information System (SIS), achievement tracking, and mentorship modules for engineering colleges. 

Built with modern web technologies and featuring a sophisticated "Warm Slate" design system, EduPulse offers a seamless, mobile-first experience tailored for Students, Faculty (Mentors), and Administrators.

## ✨ Key Features

- **Role-Based Portals:** Tailored dashboards for Students, Faculty (Mentors), and Administrators.
- **Smart Mentorship:** Track student progress, log interactions, and manage academic health.
- **Academic Tracking:** View grades, attendance summaries, and manage course materials/assignments.
- **Achievement Workflow:** Students can submit achievements for mentor verification to earn NBA points.
- **Grace Requests:** Seamless synchronization between student submissions and faculty verification for attendance or deadline grace.
- **Dynamic Campus Feed:** Global announcements, placement drives, and event notifications.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling:** [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & Auth:** [Supabase](https://supabase.com/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhihosamani03/Forge-Edupulse.git
   cd Forge-Edupulse
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Set up Environment Variables:**
   Create a `.env.local` file in the `frontend` directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(Note: Do not commit your `.env.local` file. It is already safely ignored in `.gitignore`.)*

5. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Security Notes
- This project utilizes mock data (`src/lib/mock-data.ts`) for demonstration purposes. No real PII is included in the demo data.
- The `login/page.tsx` contains hardcoded mock credentials (`student123`, `faculty123`, `admin123`) strictly for demonstrating the authentication flow in a non-production setting. 

## 📝 License
© 2024 EduPulse · Sahyadri College of Engineering & Management. All rights reserved.
