import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Code2,
  Database,
  Network,
  Server,
  Cpu,
  ArrowRight,
  Clock,
  FileQuestion,
} from 'lucide-react';

const EXAM_TYPES = [
  {
    id: 'DSA',
    name: 'Data Structures & Algorithms',
    icon: Code2,
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Arrays, Trees, Graphs, Dynamic Programming',
    questions: 10,
    time: 30,
  },
  {
    id: 'SQL',
    name: 'SQL & Databases',
    icon: Database,
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    description: 'Queries, Joins, Indexes, Optimization',
    questions: 10,
    time: 25,
  },
  {
    id: 'CN',
    name: 'Computer Networks',
    icon: Network,
    color: 'from-purple-500 to-violet-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'TCP/IP, HTTP, DNS, Security',
    questions: 10,
    time: 20,
  },
  {
    id: 'DBMS',
    name: 'Database Management',
    icon: Server,
    color: 'from-amber-500 to-orange-600',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    description: 'Normalization, ACID, Transactions',
    questions: 10,
    time: 25,
  },
  {
    id: 'OS',
    name: 'Operating Systems',
    icon: Cpu,
    color: 'from-rose-500 to-pink-600',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    description: 'Processes, Memory, Scheduling',
    questions: 10,
    time: 25,
  },
];

export default function ExamSelector({ onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {EXAM_TYPES.map((exam) => (
        <Card
          key={exam.id}
          className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
          onClick={() => onSelect(exam.id)}
        >
          <div className={`h-2 bg-gradient-to-r ${exam.color}`} />

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-2xl ${exam.lightColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <exam.icon
                  className={`w-7 h-7 ${exam.textColor}`}
                />
              </div>

              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="font-bold text-lg text-slate-800 mb-2">
              {exam.name}
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              {exam.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <FileQuestion className="w-4 h-4" />
                {exam.questions} questions
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {exam.time} min
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
