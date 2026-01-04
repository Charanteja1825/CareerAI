import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Plus, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function StudyTracker({ onLog, todayLog }) {
  const [hours, setHours] = useState('');
  const [topics, setTopics] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await onLog({
      date: format(new Date(), 'yyyy-MM-dd'),
      hoursStudied: parseFloat(hours) || 0,
      topicsCovered: topics
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      notes: notes,
    });

    setHours('');
    setTopics('');
    setNotes('');
    setIsSubmitting(false);
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          Daily Study Tracker
        </CardTitle>
      </CardHeader>

      <CardContent>
        {todayLog ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Today&apos;s Study Logged!
            </h3>

            <p className="text-slate-500 mb-4">
              You studied{' '}
              <span className="font-bold text-emerald-600">
                {todayLog.hoursStudied} hours
              </span>{' '}
              today
            </p>

            {todayLog.topicsCovered?.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {todayLog.topicsCovered.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Hours Studied Today
              </Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="e.g., 2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="h-12 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Topics Covered (comma separated)
              </Label>
              <Input
                placeholder="e.g., Arrays, Trees, SQL Joins"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className="h-12 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes (optional)</Label>
              <Textarea
                placeholder="Any notes about today's study session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white"
              />
            </div>

            <Button
              type="submit"
              disabled={!hours || isSubmitting}
              className="w-full h-12 gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Plus className="w-5 h-5" />
              Log Today&apos;s Study
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
