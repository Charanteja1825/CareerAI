import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ProgressChart({ data, title = 'Performance Trend' }) {
  const hasData = data && data.length > 0;

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!hasData ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No data to display yet</p>
              <p className="text-sm">Complete exams to see your progress</p>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />

                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />

                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
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

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
