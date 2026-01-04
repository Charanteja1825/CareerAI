import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Heart,
  Brain,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Loader2
} from 'lucide-react';

export default function InterviewFeedback({ sessionData, onRetry, onBack }) {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);

      const res = await api.post(
        `/interviews/${sessionData.id}/feedback`,
        sessionData
      );

      setFeedback(res.data);
    } catch (err) {
      console.error('Failed to load feedback', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-500 animate-spin" />
            <h3 className="text-xl font-semibold text-slate-700">
              Analyzing Your Interview...
            </h3>
            <p className="text-slate-500 mt-2">
              AI is evaluating your performance
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />
        <CardContent className="p-8 flex items-center justify-between">
          <div>
            <p className="text-slate-500 mb-2">Overall Score</p>
            <h1 className={`text-6xl font-bold ${getScoreColor(sessionData.overall_score)}`}>
              {sessionData.overall_score}%
            </h1>
            <p className="text-slate-600 mt-2">
              Duration: {formatTime(sessionData.duration)}
            </p>
          </div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <ThumbsUp className="w-5 h-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedback?.strengths?.map((s, i) => (
            <div key={i} className="flex gap-3 p-3 bg-emerald-50 rounded-xl">
              <ArrowRight className="w-4 h-4 text-emerald-600 mt-1" />
              <p>{s}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedback?.weaknesses?.map((w, i) => (
            <div key={i} className="flex gap-3 p-3 bg-amber-50 rounded-xl">
              <ArrowRight className="w-4 h-4 text-amber-600 mt-1" />
              <p>{w}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Lightbulb className="w-5 h-5" />
            Improvement Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedback?.improvement_tips?.map((tip, i) => (
            <div key={i} className="flex gap-3 p-3 bg-indigo-50 rounded-xl">
              <span className="font-bold text-indigo-600">{i + 1}</span>
              <p>{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Interviews
        </Button>
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Practice Again
        </Button>
      </div>
    </div>
  );
}
