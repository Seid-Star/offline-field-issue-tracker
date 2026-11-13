import { MotionConfig } from 'motion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from './components/common/ToastContainer.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { NetworkProvider } from './context/NetworkContext.jsx';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard.jsx';
import { CreateReport } from './pages/CreateReport.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { Register } from './pages/Register.jsx';
import { ReportDetails } from './pages/ReportDetails.jsx';
import { Reports } from './pages/Reports.jsx';
import { Settings } from './pages/Settings.jsx';
import { SyncCenter } from './pages/SyncCenter.jsx';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <NetworkProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/create" element={<CreateReport />} />
              <Route path="/reports/:id" element={<ReportDetails />} />
              <Route path="/coordinator" element={<CoordinatorDashboard />} />
              <Route path="/sync" element={<SyncCenter />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </AppProvider>
        </NetworkProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
