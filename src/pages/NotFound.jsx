import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';

export function NotFound() {
  return (
    <AppShell title="Page Not Found" breadcrumbs={[{ label: '404' }]}>
      <div className="max-w-lg mx-auto rounded-2xl bg-white border border-[#123D35]/10 p-8 text-center my-8">
        <p className="text-xs font-mono text-[#71817B]">404</p>
        <h2 className="mt-2 text-xl font-bold text-[#172B27] font-display">
          Route not found
        </h2>
        <p className="mt-2 text-sm text-[#71817B]">
          The requested field operations page does not exist. Return to the dashboard or browse your locally stored reports.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">Back to Landing</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
