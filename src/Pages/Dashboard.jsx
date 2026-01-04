import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfWeek, endOfWeek, differenceInDays, isWithinInterval } from "date-fns";
import {
  FileText,
  Award,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import api from "../services/api";

import StatCard from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import ProgressChart from "../components/dashboard/ProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  /* =========================
     Load Logged-in User
  ========================== */
  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  /* =========================
     API Calls
  ========================== */

  const { data: exams = [] } = useQuery({
    queryKey: ["exams"],
    queryFn: () => api.get("/exams").then(res => res.data),
    enabled: !!user,
  });

  const { data: interviews = [] } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => api.get("/interviews").then(res => res.data),
    enabled: !!user,
  });

  const { data: skillGaps = [] } = useQuery({
    queryKey: ["skillgaps"],
    queryFn: () => api.get("/skill-gaps").then(res => res.data),
    enabled: !!user,
  });

  const { data: studyLogs = [] } = useQuery({
    queryKey: ["studylogs"],
    queryFn: () => api.get("/study-logs").then(res => res.data),
    enabled: !!user,
  });

  /* =========================
     Calculations (UNCHANGED)
  ========================== */

  const totalExams = exams.length;

  const averageScore =
    exams.length > 0
      ? Math.round(exams.reduce((sum, e) => sum + (e.score || 0), 0) / exams.length)
      : 0;

  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  const studyHoursThisWeek = studyLogs
    .filter(log =>
      isWithinInterval(new Date(log.date), {
        start: weekStart,
        end: weekEnd,
      })
    )
    .reduce((sum, log) => sum + (log.hoursStudied || 0), 0);

  const calculateStreak = () => {
    if (!studyLogs.length) return 0;

    const sorted = [...studyLogs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const log of sorted) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      const diff = differenceInDays(current, logDate);
      if (diff <= 1) {
        streak++;
        current = logDate;
      } else break;
    }
    return streak;
  };

  const streak = calculateStreak();

  const chartData = exams
    .slice(0, 10)
    .reverse()
    .map(exam => ({
      date: format(new Date(exam.createdDate), "MMM d"),
      score: exam.score || 0,
    }));

  /* =========================
     UI (UNCHANGED)
  ========================== */

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-10 blur-3xl" />
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-600">
                  Welcome back
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                {user?.fullName || "User"}
              </h1>
              <p className="text-slate-500 mt-2 max-w-md">
                Track your progress, identify skill gaps, and ace your career goals
                with AI-powered insights.
              </p>
            </div>

            <div className="hidden sm:block">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Exams" value={totalExams} subtitle="Completed assessments" icon={FileText} color="indigo" />
        <StatCard title="Average Score" value={`${averageScore}%`} subtitle="Across all exams" icon={Award} color="emerald" />
        <StatCard title="Study Hours" value={studyHoursThisWeek.toFixed(1)} subtitle="This week" icon={Clock} color="cyan" />
        <StatCard title="Current Streak" value={`${streak} days`} subtitle="Keep it going!" icon={Flame} color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart data={chartData} title="Exam Performance Trend" />
        </div>
        <RecentActivity exams={exams} interviews={interviews} skillGaps={skillGaps} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickCard title="Skill Gap Reports" value={skillGaps.length} icon={Target} />
        <QuickCard title="Mock Interviews" value={interviews.length} icon={TrendingUp} />
        <QuickCard title="Total Study Time" value={`${studyLogs.reduce((s, l) => s + (l.hoursStudied || 0), 0).toFixed(1)}h`} icon={Clock} />
      </div>
    </div>
  );
}

/* =========================
   Small Helper Component
========================= */
function QuickCard({ title, value, icon: Icon }) {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </CardContent>
    </Card>
  );
}
