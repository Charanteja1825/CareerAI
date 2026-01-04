import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'indigo',
}) {
  const colorMap = {
    indigo: {
      bg: 'from-indigo-500 to-indigo-600',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
      shadow: 'shadow-indigo-500/20',
    },
    cyan: {
      bg: 'from-cyan-500 to-cyan-600',
      light: 'bg-cyan-50',
      text: 'text-cyan-600',
      shadow: 'shadow-cyan-500/20',
    },
    emerald: {
      bg: 'from-emerald-500 to-emerald-600',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      shadow: 'shadow-emerald-500/20',
    },
    amber: {
      bg: 'from-amber-500 to-amber-600',
      light: 'bg-amber-50',
      text: 'text-amber-600',
      shadow: 'shadow-amber-500/20',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      shadow: 'shadow-purple-500/20',
    },
  };

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>

            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
            )}

            {trend && (
              <div
                className={`flex items-center gap-1 mt-3 text-sm ${
                  trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{trendValue}</span>
                <span className="text-slate-400">vs last week</span>
              </div>
            )}
          </div>

          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.shadow} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </Card>
  );
}
