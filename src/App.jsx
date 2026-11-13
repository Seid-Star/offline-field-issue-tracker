import { MotionConfig } from "motion/react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "./components/common/ToastContainer.jsx";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { NetworkProvider } from "./context/NetworkContext.jsx";

import { CoordinatorDashboard } from "./pages/CoordinatorDashboard.jsx";
import { CreateReport } from "./pages/CreateReport.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Landing } from "./pages/Landing.jsx";
import { Login } from "./pages/Login.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Register } from "./pages/Register.jsx";
import { ReportDetails } from "./pages/ReportDetails.jsx";
import { Reports } from "./pages/Reports.jsx";
import { Settings } from "./pages/Settings.jsx";
import { SyncCenter } from "./pages/SyncCenter.jsx";

function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useApp();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EFEEEC]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#BE732F]/20 border-t-[#F4B64F]" />
          <p className="text-sm font-medium text-[#552F0B]">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <NetworkProvider>
          <AppProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected workspace routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/create" element={<CreateReport />} />
                <Route path="/reports/:id" element={<ReportDetails />} />
                <Route path="/coordinator" element={<CoordinatorDashboard />} />
                <Route path="/sync" element={<SyncCenter />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer />
          </AppProvider>
        </NetworkProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
