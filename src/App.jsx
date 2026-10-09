import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import useUserStore from './store/useUserStore';
import useWorkoutStore from './store/useWorkoutStore';
import useDietStore from './store/useDietStore';
import useDailyLogStore from './store/useDailyLogStore';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';

// App Pages
import Dashboard from './pages/Dashboard';
import WorkoutPlan from './pages/WorkoutPlan';
import DietPlan from './pages/DietPlan';
import DailyLog from './pages/DailyLog';
import CalendarView from './pages/CalendarView';
import HistoryView from './pages/HistoryView';
import Profile from './pages/Profile';
import ExpenseTracker from './pages/ExpenseTracker';
import ExerciseGuide from './pages/ExerciseGuide';
import useExpenseStore from './store/useExpenseStore';

// Layout
import Layout from './components/layout/Layout';

function ProtectedRoute() {
  const { isAuthenticated, isOnboarded } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

function AuthRoute() {
  const { isAuthenticated, isOnboarded } = useAuthStore();
  if (isAuthenticated && isOnboarded) return <Navigate to="/" replace />;
  if (isAuthenticated && !isOnboarded) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

export default function App() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Keep all stores aligned to the current authenticated user email
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const email = user.email.toLowerCase();
      useUserStore.getState().setCurrentUser(email);
      useWorkoutStore.getState().setCurrentUser(email);
      useDietStore.getState().setCurrentUser(email);
      useDailyLogStore.getState().setCurrentUser(email);
      useExpenseStore.getState().setCurrentUser(email);
    }
  }, [isAuthenticated, user?.email]);

  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/onboarding" element={<Onboarding />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan/workout" element={<WorkoutPlan />} />
          <Route path="/plan/diet" element={<DietPlan />} />
          <Route path="/log" element={<DailyLog />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/history" element={<HistoryView />} />
          <Route path="/expenses" element={<ExpenseTracker />} />
          <Route path="/exercises" element={<ExerciseGuide />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
