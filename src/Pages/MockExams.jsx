import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";

import api from "../services/api";

import ExamSelector from "../components/exams/ExamSelector";
import ExamQuestions from "../components/exams/ExamQuestions";
import ExamResults from "../components/exams/ExamResults";

/* =========================
   AI Question Generation
   (via Backend API)
========================= */
async function generateExamQuestions(examType) {
  const res = await api.post("/ai/exams/generate", {
    examType,
    count: 10,
  });
  return res.data.questions;
}

export default function MockExams() {
  const [stage, setStage] = useState("select"); // select | exam | results
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examResult, setExamResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  /* =========================
     SAVE RESULT
  ========================== */
  const saveMutation = useMutation({
    mutationFn: (result) => api.post("/exams", result),
    onSuccess: () => {
      queryClient.invalidateQueries(["exams"]);
    },
  });

  /* =========================
     HANDLERS
  ========================== */
  const handleSelectExam = async (examType) => {
    setIsLoading(true);
    setSelectedExam(examType);

    try {
      const generated = await generateExamQuestions(examType);
      setQuestions(generated);
      setStage("exam");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamComplete = async (result) => {
    setExamResult(result);
    await saveMutation.mutateAsync(result);
    setStage("results");
  };

  const handleRetry = () => {
    setQuestions([]);
    setExamResult(null);
    handleSelectExam(selectedExam);
  };

  const handleBack = () => {
    setStage("select");
    setSelectedExam(null);
    setQuestions([]);
    setExamResult(null);
  };

  /* =========================
     LOADING UI
  ========================== */
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Generating Questions...
          </h3>
          <p className="text-slate-500">
            AI is creating your personalized exam
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================== */
  return (
    <div className="space-y-8">
      {stage === "select" && (
        <>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Mock Exams
            </h1>
            <p className="text-slate-500 mt-2">
              Test your knowledge with AI-generated assessments
            </p>
          </div>

          <ExamSelector onSelect={handleSelectExam} />
        </>
      )}

      {stage === "exam" && questions.length > 0 && (
        <ExamQuestions
          questions={questions}
          examType={selectedExam}
          onComplete={handleExamComplete}
        />
      )}

      {stage === "results" && examResult && (
        <ExamResults
          result={examResult}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
