import { ArrowRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { CategoryChart } from '../components/dashboard/CategoryChart.jsx';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed.jsx';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { SyncHealthPanel } from '../components/dashboard/SyncHealthPanel.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ReportCard } from '../components/reports/ReportCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useNetwork } from '../context/NetworkContext.jsx';

export function Dashboard() {
  const { currentUser, reports, activities, stats, isInitializing } = useApp();
  const { effectiveOnline } = useNetwork();

  const recentReports = reports.slice(0, 4);

  return (
    <AppShell title="Operations Overview" breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <section className="animate-enter rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#1B5B4C]">
              {currentUser.role} · {currentUser.unit}
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[#172B27] font-display tracking-tight text-balance">
              Welcome back, {currentUser.name.split(' ')[0]}
            </h2>
            <p className="mt-1.5 text-sm text-[#71817B] leading-relaxed">
              {effectiveOnline
                ? 'Local IndexedDB storage is active and the simulated sync adapter is reachable for queued field reports.'
                : 'You are operating offline. New reports and status changes are persisted locally in IndexedDB until connectivity returns.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link to="/reports">
              <Button variant="secondary" size="md">
                <span>Browse Reports</span>
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="primary" size="md">
                <PlusCircle className="w-4 h-4" />
                <span>Create Report</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* KPI Grid */}
        <section aria-label="Field operations summary metrics" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            label="Total Reports"
            value={isInitializing ? '—' : stats.total}
            caption={`${stats.drafts} local draft${stats.drafts === 1 ? '' : 's'}`}
            delayClass="stagger-1"
          />
          <StatCard
            label="Pending Sync"
            value={isInitializing ? '—' : stats.pendingSync}
            caption={
              stats.failedSync > 0
                ? `${stats.failedSync} failed awaiting retry`
                : 'Ready in IndexedDB queue'
            }
            accent={stats.pendingSync > 0 ? 'amber' : 'default'}
            delayClass="stagger-2"
          />
          <StatCard
            label="Submitted"
            value={isInitializing ? '—' : stats.submitted}
            caption="Awaiting coordinator triage"
            delayClass="stagger-3"
          />
          <StatCard
            label="In Progress"
            value={isInitializing ? '—' : stats.inProgress}
            caption={`${stats.assigned} assigned to crews`}
            accent="amber"
            delayClass="stagger-4"
          />
          <StatCard
            label="Resolved"
            value={isInitializing ? '—' : stats.resolved}
            caption="Verified field completion"
            accent="emerald"
            delayClass="stagger-5"
          />
        </section>

        {/* Main Asymmetric 2-Column Analytical & Sync Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7">
            <CategoryChart reports={reports} />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <SyncHealthPanel />
          </div>
        </div>

        {/* Recent Reports + Activity Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <section className="xl:col-span-8 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-[#172B27] font-display">
                  Recent Field Reports
                </h2>
                <p className="text-xs text-[#71817B]">
                  Latest infrastructure issues stored in local IndexedDB
                </p>
              </div>
              <Link
                to="/reports"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#123D35] hover:underline whitespace-nowrap"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {recentReports.length === 0 ? (
              <EmptyState
                title="No field reports stored locally"
                description="Create your first offline-capable infrastructure report to see it persisted here."
                action={
                  <Link to="/create">
                    <Button variant="primary">Create Report</Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {recentReports.map((rep) => (
                  <ReportCard key={rep.clientId} report={rep} />
                ))}
              </div>
            )}
          </section>

          <div className="xl:col-span-4">
            <RecentActivityFeed activities={activities} reports={reports} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
