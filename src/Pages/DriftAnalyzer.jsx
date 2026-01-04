import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  format,
  startOfWeek,
  endOfWeek,
  subWeeks,
  isWithinInterval,
  parseISO,
  subDays,
} from "date-fns";

import api from "../services/api";

import StudyTracker from "../components/drift/StudyTracker";
import ProgressCharts from "../components/drift/ProgressCharts";
import WeeklyComparison from "../components/drift/WeeklyComparison";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Flame,
  Award,
} from "lucide-react";

export default function DriftAnalyzer() {
  const queryClient = useQueryClient();

  /* =========================
     DATA FETCHING
  ========================== */

  const { data: studyLogs = [] } = useQuery({
    queryKey: ["study-logs"],
    queryFn: () => api.get("/study-logs").then(res => res.data),
  });

  const { data: exams = [] } = useQuery({
    queryKey: ["exams-drift"],
    queryFn: () => api.get("/exams").then(res => res.data),
  });

  /* =========================
     MUTATION
  ========================== */

  const logMutation = useMutation({
    mutationFn: (data) => api.post("/study-logs", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["study-logs"]);
    },
  });

  /* =========================
     DERIVED DATA
  ========================== */

  const today = format(new Date(), "yyyy-MM-dd");
  const todayLog = studyLogs.find(log => log.date === today);

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const log = studyLogs.find(l => l.date === dateStr);

    return {
      date: format(date, "MMM d"),
      hours: log?.hoursStudied || 0,
    };
  });

  const examChartData = exams.slice(0, 14).reverse().map(exam => ({
    date: format(new Date(exam.createdDate), "MMM d"),
    score: exam.score || 0,
    accuracy: exam.accuracy || 0,
  }));

  const aiUsageData = exams.slice(0, 14).reverse().map(exam => ({
    date: format(new Date(exam.createdDate), "MMM d"),
    aiUsage: exam.aiUsagePercentage || 0,
  }));

  /* =========================
     WEEKLY STATS
  ========================== */

  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = endOfWeek(now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));

  const getWeeklyStats = (start, end) => {
    const weekLogs = studyLogs.filter(log =>
      isWithinInterval(parseISO(log.date), { start, end })
    );

    const weekExams = exams.filter(exam =>
      isWithinInterval(new Date(exam.createdDate), { start, end })
    );

    return {
      studyHours: weekLogs.reduce((s, l) => s + (l.hoursStudied || 0), 0),
      avgScore:
        weekExams.length > 0
          ? weekExams.reduce((s, e) => s + (e.score || 0), 0) / weekExams.length
          : 0,
      examCount: weekExams.length,
      avgAiUsage:
        weekExams.length > 0
          ? weekExams.reduce((s, e) => s + (e.aiUsagePercentage || 0), 0) /
            weekExams.length
          : 0,
    };
  };

  const thisWeekStats = getWeeklyStats(thisWeekStart, thisWeekEnd);
  const lastWeekStats = getWeeklyStats(lastWeekStart, lastWeekEnd);

  /* =========================
     STREAK + TOTALS
  ========================== */

  const calculateStreak = () => {
    if (!studyLogs.length) return 0;

    const sorted = [...studyLogs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const log of sorted) {
      const logDate = parseISO(log.date);
      logDate.setHours(0, 0, 0, 0);

      const diff = Math.floor((current - logDate) / (1000 * 60 * 60 * 24));
      if (diff <= 1) {
        streak++;
        current = logDate;
      } else break;
    }
    return streak;
  };

  const totalStudyHours = studyLogs.reduce(
    (s, l) => s + (l.hoursStudied || 0),
    0
  );

  const avgExamScore =
    exams.length > 0
      ? Math.round(
          exams.reduce((s, e) => s + (e.score || 0), 0) / exams.length
        )
      : 0;

  /* =========================
     UI (UNCHANGED)
  ========================== */

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          Drift Analyzer
        </h1>
        <p className="text-slate-500 mt-2">
          Track your daily progress and analyze performance trends
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Study" value={`${totalStudyHours.toFixed(1)}h`} icon={Clock} color="emerald" />
        <Stat label="Avg Score" value={`${avgExamScore}%`} icon={Target} color="indigo" />
        <Stat label="Day Streak" value={calculateStreak()} icon={Flame} color="amber" />
        <Stat label="Exams Done" value={exams.length} icon={Award} color="cyan" />
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <StudyTracker
          onLog={(data) => logMutation.mutateAsync(data)}
          todayLog={todayLog}
        />
        <div className="lg:col-span-2">
          <WeeklyComparison
            thisWeek={thisWeekStats}
            lastWeek={lastWeekStats}
          />
        </div>
      </div>

      <ProgressCharts
        studyData={last14Days}
        examData={examChartData}
        aiUsageData={aiUsageData}
      />

      {/* Recent Logs */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-500" />
            Recent Study Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studyLogs.length === 0 ? (
            <p className="text-center text-slate-400 py-8">
              No study logs yet
            </p>
          ) : (
            <div className="space-y-3">
              {studyLogs.slice(0, 7).map(log => (
                <div key={log.id} className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium">
                      {format(parseISO(log.date), "EEEE, MMM d")}
                    </p>
                    <p className="text-sm text-slate-500">
                      {log.topicsCovered?.slice(0, 3).join(", ")}
                    </p>
                  </div>
                  <p className="font-bold text-emerald-600">
                    {log.hoursStudied}h
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================
   STAT TILE
========================= */
function Stat({ label, value, icon: Icon, color }) {
  return (
    <Card className="border-0 bg-white/70 shadow-lg">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
