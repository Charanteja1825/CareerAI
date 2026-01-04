import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  Bot,
} from 'lucide-react';

export default function ExamResults({ result, onRetry, onBack }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Card */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${getScoreBg(result.score)}`} />
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 mb-2">Your Score</p>
              <h1 className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </h1>
              <p className="text-slate-600 mt-2">
                {result.correctAnswers} out of {result.totalQuestions} correct
              </p>
            </div>
            <div
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${getScoreBg(
                result.score
              )} flex items-center justify-center`}
            >
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
            <p className="text-2xl font-bold text-slate-800">
              {formatTime(result.timeSpent)}
            </p>
            <p className="text-xs text-slate-500">Time Spent</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold text-slate-800">
              {result.accuracy}%
            </p>
            <p className="text-xs text-slate-500">Accuracy</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-slate-800">
              {result.aiUsagePercentage}%
            </p>
            <p className="text-xs text-slate-500">AI Usage</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold text-slate-800">
              {result.weakTopics?.length || 0}
            </p>
            <p className="text-xs text-slate-500">Weak Areas</p>
          </CardContent>
        </Card>
      </div>

      {/* Weak Topics */}
      {result.weakTopics?.length > 0 && (
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map((topic, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Review */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-500" />
            Question Review
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {result.questions?.map((q, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 ${
                q.isCorrect
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-red-200 bg-red-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    q.isCorrect ? 'bg-emerald-100' : 'bg-red-100'
                  }`}
                >
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-slate-800 mb-2">
                    Q{idx + 1}: {q.question}
                  </p>

                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Your answer:</span>{' '}
                    {q.userAnswer || 'Not answered'}
                  </p>

                  {!q.isCorrect && (
                    <p className="text-sm text-emerald-600">
                      <span className="font-medium">Correct answer:</span>{' '}
                      {q.correctAnswer}
                    </p>
                  )}

                  {q.explanation && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        AI Explanation
                      </p>
                      <p className="text-slate-700">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Exams
        </Button>
        <Button
          onClick={onRetry}
          className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
