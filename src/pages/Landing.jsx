import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  History,
  MapPin,
  RefreshCw,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { ClayCard } from '../components/ui/ClayCard.jsx';
import { GlassCard } from '../components/ui/GlassCard.jsx';
import { PrimaryButton } from '../components/ui/PrimaryButton.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatShortDate } from '../utils/formatters.js';

const FEATURES = [
  {
    icon: WifiOff,
    title: 'Offline-First Reporting',
    description:
      'Capture infrastructure issues, GPS coordinates, and severity ratings even in zero-signal zones without losing data.',
  },
  {
    icon: RefreshCw,
    title: 'Automatic Synchronization',
    description:
      'Submitted reports enter a resilient local queue and synchronize idempotently as soon as connectivity returns.',
  },
  {
    icon: Activity,
    title: 'Real-Time Issue Tracking',
    description:
      'Follow every report across its validated lifecycle from local Draft and Submitted through Assigned and Resolved.',
  },
  {
    icon: ShieldCheck,
    title: 'Coordinator Dashboard',
    description:
      'Triage urgent high-priority issues, assign field response crews, and enforce valid status transitions.',
  },
  {
    icon: History,
    title: 'Activity History',
    description:
      'Maintain an auditable chronological timeline of local saves, sync attempts, crew assignments, and field updates.',
  },
  {
    icon: Database,
    title: 'Reliable Data Persistence',
    description:
      'Powered by IndexedDB with Dexie.js and PWA app-shell caching so your workspace survives browser restarts.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Report',
    subtitle: 'Field workers create reports.',
    detail:
      'Inspect a water point, road culvert, or substation offline. Save a local draft or submit directly into the local sync queue.',
  },
  {
    number: '02',
    title: 'Synchronize',
    subtitle: 'Reports synchronize when internet returns.',
    detail:
      'Every report uses a stable UUID clientId so retries never create duplicates and failed attempts preserve local data safely.',
  },
  {
    number: '03',
    title: 'Resolve',
    subtitle: 'Coordinators assign and resolve issues.',
    detail:
      'Dispatch teams review incoming reports, assign responsible units, monitor progress, and verify field completion.',
  },
];

export function Landing() {
  const { reports, stats, isSyncing } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const previewReports = reports.slice(0, 3);

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="home" className="min-h-screen flex flex-col bg-[#F5F7F5] text-[#172B27] overflow-x-hidden">
      <Navbar variant="dark" />

      {/* HERO SECTION — Glassmorphism over Deep Forest Green */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#092B27] via-[#0F352E] to-[#123D35] text-white">
        {/* Subtle decorative ambient light orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 -left-20 w-[26rem] h-[26rem] rounded-full bg-[#16A477]/20 blur-3xl" />
          <div className="absolute top-1/4 right-0 w-[30rem] h-[30rem] rounded-full bg-[#1B5B4C]/35 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 w-80 h-80 rounded-full bg-[#E6A23C]/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Copy */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#16A477]">
                Offline-First Field Operations Platform
              </p>

              <h1
                className="font-display font-bold tracking-tight text-white text-balance leading-[1.08]"
                style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.6rem)' }}
              >
                Report Issues. Stay Connected. Work Anywhere.
              </h1>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
                An offline-first field reporting platform that helps teams report infrastructure problems, synchronize information, and resolve issues faster.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link to="/register">
                  <PrimaryButton variant="emerald" size="lg">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                </Link>
                <PrimaryButton
                  variant="glass"
                  size="lg"
                  onClick={scrollToFeatures}
                >
                  Explore Features
                </PrimaryButton>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/70">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#16A477] transition-colors underline underline-offset-4"
                >
                  <span>Open Live Field Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <span aria-hidden="true">·</span>
                <span>IndexedDB Persistence</span>
                <span aria-hidden="true">·</span>
                <span>PWA Ready</span>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Dashboard Preview */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className={shouldReduceMotion ? '' : 'animate-float'}>
                <GlassCard className="p-5 sm:p-6 space-y-5">
                  {/* Preview Top Bar */}
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/14">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-[#16A477]/20 border border-[#16A477]/40 flex items-center justify-center text-[#16A477] shrink-0">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold font-display truncate">
                          Operations Dispatch Preview
                        </p>
                        <p className="text-[11px] text-white/65 truncate">
                          Live local IndexedDB snapshot
                        </p>
                      </div>
                    </div>

                    {/* Animated Synchronization Indicator */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-medium shrink-0">
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-[#16A477] ${
                          shouldReduceMotion ? '' : isSyncing ? 'animate-spin' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>Sync Ready</span>
                    </div>
                  </div>

                  {/* Preview KPI Grid */}
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    <div className="rounded-xl bg-white/[0.08] border border-white/12 p-3">
                      <p className="text-[11px] text-white/70">Total Reports</p>
                      <p className="mt-1 text-xl sm:text-2xl font-bold font-display tabular-nums">
                        {stats.total || 10}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/[0.08] border border-white/12 p-3">
                      <div className="flex items-center gap-1 text-[11px] text-[#F7C97E]">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>Pending</span>
                      </div>
                      <p className="mt-1 text-xl sm:text-2xl font-bold font-display tabular-nums">
                        {stats.pendingSync}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/[0.08] border border-white/12 p-3">
                      <div className="flex items-center gap-1 text-[11px] text-[#5CE1B2]">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        <span>Resolved</span>
                      </div>
                      <p className="mt-1 text-xl sm:text-2xl font-bold font-display tabular-nums">
                        {stats.resolved || 1}
                      </p>
                    </div>
                  </div>

                  {/* Synchronization Status Strip */}
                  <div className="rounded-xl bg-[#092B27]/60 border border-white/12 px-4 py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-medium text-white">Synchronization Status</p>
                      <p className="text-white/65 mt-0.5 tabular-nums">
                        {stats.synchronized} synchronized · {stats.pendingSync} queued · {stats.failedSync} failed
                      </p>
                    </div>
                    <Link
                      to="/sync"
                      className="text-[#16A477] hover:underline font-semibold whitespace-nowrap shrink-0"
                    >
                      Inspect Queue
                    </Link>
                  </div>

                  {/* Recent Field Reports */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span className="font-medium text-white/90">Recent Field Reports</span>
                      <Link to="/reports" className="hover:text-white transition-colors">
                        View all
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {previewReports.map((rep) => (
                        <Link
                          key={rep.clientId}
                          to={`/reports/${rep.clientId}`}
                          className="block rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/12 px-3.5 py-2.5 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">
                              {rep.title}
                            </p>
                            <span className="text-[11px] font-mono tabular-nums text-[#5CE1B2] shrink-0">
                              {rep.status}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-white/65 truncate tabular-nums">
                            {rep.category} · {rep.location?.name} · {formatShortDate(rep.reportedAt)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION — Claymorphism */}
      <section
        id="features"
        className="py-16 sm:py-24 bg-gradient-to-b from-[#F5F7F5] via-[#EEF4F0] to-[#F5F7F5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-[#1B5B4C] tracking-wide">
              Core Capabilities
            </p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-display text-[#172B27] tracking-tight text-balance">
              Engineered for field reliability and coordinator clarity
            </h2>
            <p className="mt-3 text-base text-[#71817B] leading-relaxed">
              Every module separates local capture from deferred server synchronization so teams never lose critical infrastructure reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.35,
                    delay: shouldReduceMotion ? 0 : idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ClayCard hover className="p-6 sm:p-7 h-full flex flex-col">
                    <div className="clay-icon-well w-13 h-13 rounded-2xl flex items-center justify-center text-[#123D35] mb-5">
                      <Icon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold font-display text-[#172B27]">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#71817B] leading-relaxed">
                      {feat.description}
                    </p>
                  </ClayCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-[#123D35]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-[#1B5B4C] tracking-wide">
              How It Works
            </p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-display text-[#172B27] tracking-tight text-balance">
              Three reliable steps from field observation to verified fix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-[#F5F7F5] border border-[#123D35]/10 p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-sm font-semibold text-[#16A477] tabular-nums">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-xl font-bold font-display text-[#172B27]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#123D35]">
                    {step.subtitle}
                  </p>
                  <p className="mt-3 text-sm text-[#71817B] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT & CTA SECTION */}
      <section id="about" className="py-16 sm:py-24 bg-[#F5F7F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#092B27] via-[#123D35] to-[#1B5B4C] text-white p-8 sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-[#16A477]/20 blur-3xl" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs font-semibold text-[#16A477]">
                  Built by NilePixel Technologies Cohort 1
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-balance">
                  Better Field Operations Start Here.
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                  Designed for water utility engineers, electrical technicians, road maintenance crews, and central operations coordinators who need dependable reporting tools regardless of network coverage.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-wrap lg:justify-end items-center gap-3">
                <Link to="/login">
                  <PrimaryButton variant="glass" size="lg">
                    Sign In
                  </PrimaryButton>
                </Link>
                <Link to="/register">
                  <PrimaryButton variant="emerald" size="lg">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
