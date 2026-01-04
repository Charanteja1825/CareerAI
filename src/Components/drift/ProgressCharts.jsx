import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Clock, Target, Bot } from 'lucide-react';

export default function ProgressCharts({ studyData, examData, aiUsageData }) {
  return (
    <div className="space-y-6">
      {/* Study Hours Chart */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            Daily Study Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData}>
                <defs>
                  <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorStudy)"
                  name="Hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Exam Performance Chart */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Exam Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={examData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5', strokeWidth: 2 }}
                  name="Score %"
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2 }}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Usage Trend */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-500" />
            AI Dependency Trend (Simulated)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar
                  dataKey="aiUsage"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  name="AI Usage %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
