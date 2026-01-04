import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Video, Target, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentActivity({ exams, interviews, skillGaps }) {
  const activities = [
    ...exams.slice(0, 3).map(e => ({
      type: 'exam',
      title: `${e.examType} Mock Exam`,
      subtitle: `Score: ${e.score}%`,
      date: e.createdDate,
      icon: FileText,
      color: 'indigo'
    })),
    ...interviews.slice(0, 3).map(i => ({
      type: 'interview',
      title: 'Mock Interview',
      subtitle: `Score: ${i.overallScore || 0}%`,
      date: i.createdDate,
      icon: Video,
      color: 'cyan'
    })),
    ...skillGaps.slice(0, 2).map(s => ({
      type: 'skillgap',
      title: `${s.targetRole} Analysis`,
      subtitle: `${s.skillGapAnalysis?.missingSkills?.length || 0} skills to learn`,
      date: s.createdDate,
      icon: Target,
      color: 'purple'
    }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity yet</p>
            <p className="text-sm">
              Start by taking an exam or analyzing your skills
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${colorMap[activity.color]} flex items-center justify-center`}
                >
                  <activity.icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {activity.subtitle}
                  </p>
                </div>

                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {format(new Date(activity.date), 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
