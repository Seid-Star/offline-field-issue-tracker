import { ArrowRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { CategoryChart } from "../components/dashboard/CategoryChart.jsx";
import { RecentActivityFeed } from "../components/dashboard/RecentActivityFeed.jsx";
import { StatCard } from "../components/dashboard/StatCard.jsx";
import { SyncHealthPanel } from "../components/dashboard/SyncHealthPanel.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ReportCard } from "../components/reports/ReportCard.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useNetwork } from "../context/NetworkContext.jsx";

export function Dashboard() {
  const { currentUser, reports, activities, stats, isInitializing } = useApp();
  const { effectiveOnline } = useNetwork();

  const recentReports = reports.slice(0, 4);

  return (
    <AppShell
      title="Operations Overview"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-7">
        {/* Welcome Banner */}
        <section className="relative isolate overflow-hidden rounded-[26px] border border-[#BE732F]/20 bg-[#0A0A0A] p-5 shadow-[0_18px_50px_rgba(85,47,11,0.10)] sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full border border-[#F4B64F]/15" />
          <div className="pointer-events-none absolute -right-8 -top-16 -z-10 h-52 w-52 rounded-full border border-[#BE732F]/20" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-[#BE732F]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F4B64F]/20 bg-[#F4B64F]/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F4B64F]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#F4B64F]">
                  {currentUser.role} · {currentUser.unit}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#EFEEEC] sm:text-3xl lg:text-[34px]">
                Welcome back,{" "}
                <span className="text-[#F4B64F]">
                  {currentUser.name.split(" ")[0]}.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#EFEEEC]/65">
                {effectiveOnline
                  ? "Your local storage is active and the synchronization service is reachable. Review your field reports and manage the pending queue."
                  : "You are currently working offline. Your reports and status changes are safely stored locally until connectivity is restored."}
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    effectiveOnline ? "bg-[#F4B64F]" : "bg-[#BE732F]"
                  }`}
                />
                <span className="text-xs font-semibold text-[#EFEEEC]/80">
                  {effectiveOnline
                    ? "LOCAL STORAGE ACTIVE · CONNECTION AVAILABLE"
                    : "OFFLINE MODE · LOCAL STORAGE ACTIVE"}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Link to="/reports">
                <Button variant="secondary" size="md">
                  Browse Reports
                </Button>
              </Link>

              <Link to="/create">
                <Button variant="primary" size="md">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Report</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* KPI Overview */}
        <section aria-label="Field operations summary metrics">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#BE732F]">
                Performance snapshot
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#552F0B]">
                Operations at a glance
              </h2>
            </div>
            <span className="hidden text-xs text-[#552F0B]/50 sm:block">
              {isInitializing ? "Loading metrics..." : "Live local data"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
            <StatCard
              label="Total Reports"
              value={isInitializing ? "—" : stats.total}
              caption={`${stats.drafts} local draft${stats.drafts === 1 ? "" : "s"}`}
              delayClass="stagger-1"
            />

            <StatCard
              label="Pending Sync"
              value={isInitializing ? "—" : stats.pendingSync}
              caption={
                stats.failedSync > 0
                  ? `${stats.failedSync} failed awaiting retry`
                  : "Ready in IndexedDB queue"
              }
              accent={stats.pendingSync > 0 ? "amber" : "default"}
              delayClass="stagger-2"
            />

            <StatCard
              label="Submitted"
              value={isInitializing ? "—" : stats.submitted}
              caption="Awaiting coordinator triage"
              delayClass="stagger-3"
            />

            <StatCard
              label="In Progress"
              value={isInitializing ? "—" : stats.inProgress}
              caption={`${stats.assigned} assigned to crews`}
              accent="amber"
              delayClass="stagger-4"
            />

            <StatCard
              label="Resolved"
              value={isInitializing ? "—" : stats.resolved}
              caption="Verified field completion"
              accent="bronze"
              delayClass="stagger-5"
            />
          </div>
        </section>

        {/* Analytics and Synchronization */}
        <section>
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#BE732F]">
              System intelligence
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-[#552F0B]">
              Reports & synchronization
            </h2>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <CategoryChart reports={reports} />
            </div>

            <div className="flex min-w-0 flex-col lg:col-span-5">
              <SyncHealthPanel />
            </div>
          </div>
        </section>

        {/* Recent Reports and Activity */}
        <section>
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#BE732F]">
              Field intelligence
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-[#552F0B]">
              Latest activity
            </h2>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            <div className="min-w-0 space-y-4 xl:col-span-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#552F0B]">
                    Recent Field Reports
                  </h3>
                  <p className="mt-1 text-xs text-[#552F0B]/55">
                    The latest infrastructure issues recorded on this device
                  </p>
                </div>

                <Link
                  to="/reports"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#BE732F] transition-colors hover:bg-[#F4B64F]/15 hover:text-[#552F0B]"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {recentReports.map((rep) => (
                    <ReportCard key={rep.clientId} report={rep} />
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0 xl:col-span-4">
              <RecentActivityFeed activities={activities} reports={reports} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
