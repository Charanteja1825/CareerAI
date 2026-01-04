import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import DriftAnalyzer from './pages/DriftAnalyzer';
import MockExams from './pages/MockExams';
import MockInterviews from './pages/MockInterviews';
import SkillGap from './pages/SkillGap';
import UserNotRegisteredError from './pages/UserNotRegisteredError';

// Optional layout (sidebar / navbar)
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <Routes>
      {/* Protected Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drift-analyzer" element={<DriftAnalyzer />} />
        <Route path="/mock-exams" element={<MockExams />} />
        <Route path="/mock-interviews" element={<MockInterviews />} />
        <Route path="/skill-gap" element={<SkillGap />} />
      </Route>

      {/* Error */}
      <Route path="/not-authorized" element={<UserNotRegisteredError />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
