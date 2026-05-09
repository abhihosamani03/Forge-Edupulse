"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Loader2, BookOpen, Users, Shield } from "lucide-react";
import { auth } from "@/lib/data-service";

type Role = "mentee" | "mentor" | "admin";

const DEMO_CREDENTIALS = {
  mentee: { email: "aditya.s@sahyadri.edu.in", password: "student123" },
  mentor: { email: "priya.shetty@sahyadri.edu.in", password: "faculty123" },
  admin: { email: "admin@sahyadri.edu.in", password: "admin123" },
};

const ROLE_LABELS = {
  mentee: { label: "Student Portal", icon: BookOpen, desc: "Access academic records, track achievements, and connect with mentors." },
  mentor: { label: "Faculty Portal", icon: Users, desc: "Manage academic progression, process attendance, and guide student development." },
  admin: { label: "Administrator", icon: Shield, desc: "Govern platform configurations, oversee system operations, and manage institutional data." },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("mentee");
  const [email, setEmail] = useState(DEMO_CREDENTIALS.mentee.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.mentee.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSwitch = (role: Role) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await auth.signIn(email);
      // For demo purposes, we still check the hardcoded password if Supabase is OFF, 
      // but if we are using the real service, we just match role/email in this prototype.
      const expected = DEMO_CREDENTIALS[selectedRole];
      
      if (user && user.role === selectedRole && password === expected.password) {
        if (selectedRole === "mentee") router.push("/student/dashboard");
        else if (selectedRole === "mentor") router.push("/mentor/dashboard");
        else router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Use the prefilled demo values.");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred during sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,168,124,0.07) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,158,135,0.06) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-surface rounded-2xl mb-4 shadow-xl border border-surface-border">
            <img src="/sahyadri-logo.png" alt="Sahyadri College Logo" className="w-auto h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight">EduPulse</h1>
          <p className="text-text-muted text-sm mt-1">Sahyadri College of Engineering &amp; Management</p>
        </div>

        {/* Role Selector */}
        <div className="card p-1.5 mb-6 grid grid-cols-3 gap-1">
          {(Object.entries(ROLE_LABELS) as [Role, typeof ROLE_LABELS[Role]][]).map(([role, { label, icon: Icon }]) => (
            <button
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-button text-xs font-medium transition-all duration-200 ${
                selectedRole === role
                  ? "bg-accent text-background shadow-sm"
                  : "text-text-muted hover:text-text-primary hover:bg-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Role Description */}
        <p className="text-center text-text-muted text-xs mb-5 animate-fade-in">
          {ROLE_LABELS[selectedRole].desc}
        </p>

        {/* Form Card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your@sahyadri.edu.in"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-input px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In as {ROLE_LABELS[selectedRole].label}
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-input bg-accent/5 border border-accent/10">
            <p className="text-xs text-text-muted text-center">
              <span className="text-accent font-medium">Demo mode</span> — credentials are pre-filled. Just click Sign In.
            </p>
          </div>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          © 2024 EduPulse · Sahyadri College of Engineering &amp; Management, Mangalore
        </p>
      </div>
    </div>
  );
}
