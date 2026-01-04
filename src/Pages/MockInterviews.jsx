import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Video,
  History,
  Calendar,
  Clock,
  Trophy,
  ChevronRight,
  Play,
} from "lucide-react";

import api from "../services/api";

import InterviewSession from "../components/interviews/InterviewSession";
import InterviewFeedback from "../components/interviews/InterviewFeedback";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MockInterviews() {
  const [stage, setStage] = useState("menu"); // menu | session | feedback
  const [sessionData, setSessionData] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const queryClient = useQueryClient();

  /* =========================
     FETCH SESSIONS
  ========================== */
  const { data: sessions = [] } = useQuery({
    queryKey: ["interview-sessions"],
    queryFn: () => api.get("/interviews").then(res => res.data),
  });

  /* =========================
     SAVE SESSION
  ========================== */
  const saveMutation = useMutation({
    mutationFn: (data) => api.post("/interviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["interview-sessions"]);
    },
  });

  /* =========================
     HANDLERS
  ========================== */
  const handleSessionComplete = async (data) => {
    setSessionData(data);
    await saveMutation.mutateAsync(data);
    setStage("feedback");
  };

  const handleRetry = () => {
    setSessionData(null);
    setStage("session");
  };

  const handleBack = () => {
    setStage("menu");
    setSessionData(null);
    setShowHistory(false);
  };

  const startNewSession = () => {
    setStage("session");
  };

  const viewSession = (session) => {
    setSessionData(session);
    setStage("feedback");
  };

  /* =========================
     HELPERS
  ========================== */
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}m`;

  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-600 bg-emerald-100";
    if (score >= 50) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  /* =========================
     STAGE RENDERING
  ========================== */
  if (stage === "session") {
    return <InterviewSession onComplete={handleSessionComplete} />;
  }

  if (stage === "feedback" && sessionData) {
    return (
      <InterviewFeedback
        sessionData={sessionData}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    );
  }

  /* =========================
     MAIN UI
  ========================== */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            Mock Interviews
          </h1>
          <p className="text-slate-500 mt-2">
            Practice your interview skills with AI-powered feedback
          </p>
        </div>

        {sessions.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            {showHistory ? "New Session" : "View History"}
          </Button>
        )}
      </div>

      {showHistory ? (
        /* =========================
           HISTORY
        ========================== */
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-700">
            Previous Sessions
          </h2>

          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card
                key={session.id}
                onClick={() => viewSession(session)}
                className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                        <Video className="w-7 h-7 text-cyan-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {session.sessionType}
                        </h3>
                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(
                              new Date(session.createdDate),
                              "MMM d, yyyy"
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(session.duration)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        className={`${getScoreColor(
                          session.overallScore
                        )} border-0 text-lg px-3 py-1`}
                      >
                        {session.overallScore}%
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* =========================
           START NEW
        ========================== */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Start New Interview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-slate-500">
                Practice answering common interview questions while AI analyzes
                your confidence, stress levels, and communication clarity.
              </p>

              <Button
                onClick={startNewSession}
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                <Play className="w-5 h-5" />
                Start Interview Session
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Your Stats
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-3xl font-bold">{sessions.length}</p>
                  <p className="text-sm text-slate-500">Total Sessions</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-3xl font-bold">
                    {sessions.length
                      ? Math.round(
                          sessions.reduce(
                            (s, x) => s + (x.overallScore || 0),
                            0
                          ) / sessions.length
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-slate-500">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
