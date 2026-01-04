import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';

export default function ExamQuestions({ questions, examType, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionTimes, setQuestionTimes] = useState({});
  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());

  /* =========================
     TIMER
  ========================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /* =========================
     ANSWER HANDLING
  ========================= */
  const handleAnswer = (answer) => {
    const timeOnQuestion = Math.floor(
      (Date.now() - questionStartRef.current) / 1000
    );

    setQuestionTimes(prev => ({
      ...prev,
      [currentIndex]: (prev[currentIndex] || 0) + timeOnQuestion,
    }));

    setAnswers(prev => ({
      ...prev,
      [currentIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  /* =========================
     SUBMIT EXAM
  ========================= */
  const handleSubmit = () => {
    const results = questions.map((q, idx) => ({
      ...q,
      userAnswer: answers[idx] || '',
      isCorrect: answers[idx] === q.correctAnswer,
      timeTaken: questionTimes[idx] || 0,
    }));

    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round(
      (correctCount / questions.length) * 100
    );

    // Simulated AI usage (replace later with real detection)
    const aiUsagePercentage = Math.round(Math.random() * 30);

    const weakTopics = [
      ...new Set(
        results
          .filter(r => !r.isCorrect)
          .map(r => r.topic)
          .filter(Boolean)
      ),
    ];

    onComplete({
      examType,
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      accuracy: score,
      timeSpent,
      aiUsagePercentage,
      questions: results,
      weakTopics,
    });
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-1">
            {examType}
          </Badge>
          <span className="text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-5 h-5 text-indigo-500" />
          <span className="font-mono text-lg">
            {formatTime(timeSpent)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl text-slate-800 leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.topic && (
              <Badge variant="secondary">
                {currentQuestion.topic}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <RadioGroup
            value={answers[currentIndex] || ''}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => handleAnswer(option)}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentIndex] === option
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label
                  htmlFor={`option-${idx}`}
                  className="flex-1 cursor-pointer text-slate-700"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <span className="text-sm text-slate-500">
          {answeredCount}/{questions.length} answered
        </span>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={answeredCount < questions.length}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500"
          >
            <Send className="w-4 h-4" />
            Submit Exam
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigator */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 mb-3">
            Question Navigator
          </p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  idx === currentIndex
                    ? 'bg-indigo-500 text-white'
                    : answers[idx]
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
