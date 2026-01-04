import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Target,
  History,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";

import api from "../services/api";

import SkillGapForm from "../components/skillgap/SkillGapForm";
import SkillGapResults from "../components/skillgap/SkillGapResults";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* =========================
   AI ANALYSIS (via API)
========================= */
async function analyzeSkillGap(data) {
  const res = await api.post("/ai/skill-gap/analyze", data);
  return res.data;
}

export default function SkillGap() {
  const [currentReport, setCurrentReport] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const queryClient = useQueryClient();

  /* =========================
     FETCH HISTORY
  ========================== */
  const { data: reports = [] } = useQuery({
    queryKey: ["skillgap-reports"],
    queryFn: () => api.get("/skill-gaps").then(res => res.data),
  });

  /* =========================
     ANALYZE + SAVE
  ========================== */
  const analysisMutation = useMutation({
    mutationFn: async (formData) => {
      // 1️⃣ AI analysis
      const aiResult = await analyzeSkillGap(formData);

      // 2️⃣ Save report
      const res = await api.post("/skill-gaps", {
        ...formData,
        skillGapAnalysis: aiResult.skillGapAnalysis,
        roadmap: aiResult.roadmap,
        strategies: aiResult.strategies,
      });

      return res.data;
    },
    onSuccess: (report) => {
      setCurrentReport(report);
      queryClient.invalidateQueries(["skillgap-reports"]);
    },
  });

  /* =========================
     HANDLERS
  ========================== */
  const handleSubmit = (data) => {
    analysisMutation.mutate(data);
  };

  const loadReport = (report) => {
    setCurrentReport(report);
    setShowHistory(false);
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            Skill Gap Analyzer
          </h1>
          <p className="text-slate-500 mt-2">
            Identify skill gaps and get a personalized learning roadmap
          </p>
        </div>

        {reports.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            {showHistory ? "New Analysis" : "View History"}
          </Button>
        )}
      </div>

      {showHistory ? (
        /* =========================
           HISTORY
        ========================== */
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-700">
            Previous Analyses
          </h2>

          <div className="grid gap-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                onClick={() => loadReport(report)}
                className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {report.targetRole}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(
                              new Date(report.createdDate),
                              "MMM d, yyyy"
                            )}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {report.preparationTime} days plan
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {report.skillGapAnalysis?.missingSkills
                      ?.slice(0, 5)
                      .map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    {report.skillGapAnalysis?.missingSkills?.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +
                        {report.skillGapAnalysis.missingSkills.length - 5}{" "}
                        more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* =========================
           ANALYSIS
        ========================== */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <SkillGapForm
              onSubmit={handleSubmit}
              isLoading={analysisMutation.isPending}
            />
          </div>

          <div className="lg:col-span-3">
            {currentReport ? (
              <SkillGapResults report={currentReport} />
            ) : (
              <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    Fill in your target role and current skills to get AI-powered
                    career guidance
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
