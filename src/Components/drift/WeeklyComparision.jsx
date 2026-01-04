import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Bot,
} from 'lucide-react';

export default function WeeklyComparison({ thisWeek, lastWeek }) {
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0)
      return { change: 0, trend: 'neutral' };

    const change = ((current - previous) / previous) * 100;

    return {
      change: Math.abs(change).toFixed(1),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  };

  const metrics = [
    {
      label: 'Study Hours',
      thisWeek: thisWeek.studyHours.toFixed(1),
      lastWeek: lastWeek.studyHours.toFixed(1),
      unit: 'hrs',
      icon: Clock,
      color: 'emerald',
      ...calculateChange(thisWeek.studyHours, lastWeek.studyHours),
    },
    {
      label: 'Avg Exam Score',
      thisWeek: thisWeek.avgScore.toFixed(0),
      lastWeek: lastWeek.avgScore.toFixed(0),
      unit: '%',
      icon: Target,
      color: 'indigo',
      ...calculateChange(thisWeek.avgScore, lastWeek.avgScore),
    },
    {
      label: 'Exams Taken',
      thisWeek: thisWeek.examCount,
      lastWeek: lastWeek.examCount,
      unit: '',
      icon: Calendar,
      color: 'cyan',
      ...calculateChange(thisWeek.examCount, lastWeek.examCount),
    },
    {
      label: 'AI Usage',
      thisWeek: thisWeek.avgAiUsage.toFixed(0),
      lastWeek: lastWeek.avgAiUsage.toFixed(0),
      unit: '%',
      icon: Bot,
      color: 'purple',
      ...calculateChange(thisWeek.avgAiUsage, lastWeek.avgAiUsage),
      invertTrend: true, // Lower AI usage is better
    },
  ];

  const colorMap = {
    emerald: 'bg-emerald-100 text-emerald-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-500" />
          Weekly Progress Comparison
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;

            const isPositive = metric.invertTrend
              ? metric.trend === 'down'
              : metric.trend === 'up';

            return (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${colorMap[metric.color]} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {metric.trend !== 'neutral' && metric.change !== '0.0' && (
                    <Badge
                      className={`${
                        isPositive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      } border-0`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {metric.change}%
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-slate-500 mb-1">
                  {metric.label}
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">
                    {metric.thisWeek}
                    {metric.unit}
                  </span>
                  <span className="text-sm text-slate-400">
                    vs {metric.lastWeek}
                    {metric.unit} last week
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
