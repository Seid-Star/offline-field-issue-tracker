import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Database,
  History,
  RefreshCw,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";

const FEATURES = [
  {
    number: "01",
    icon: WifiOff,
    title: "Offline-First Reporting",
    description:
      "Capture infrastructure issues, GPS coordinates, and severity ratings even in zero-signal zones without losing data.",
    tag: "Always available",
  },
  {
    number: "02",
    icon: RefreshCw,
    title: "Automatic Synchronization",
    description:
      "Submitted reports enter a resilient local queue and synchronize idempotently as soon as connectivity returns.",
    tag: "Seamless sync",
  },
  {
    number: "03",
    icon: Activity,
    title: "Real-Time Issue Tracking",
    description:
      "Follow every report across its validated lifecycle from local Draft and Submitted through Assigned and Resolved.",
    tag: "Full visibility",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Coordinator Dashboard",
    description:
      "Triage urgent high-priority issues, assign field response crews, and enforce valid status transitions.",
    tag: "Central control",
  },
  {
    number: "05",
    icon: History,
    title: "Activity History",
    description:
      "Maintain an auditable chronological timeline of local saves, sync attempts, crew assignments, and field updates.",
    tag: "Accountability",
  },
  {
    number: "06",
    icon: Database,
    title: "Reliable Data Persistence",
    description:
      "Powered by IndexedDB with Dexie.js and PWA app-shell caching so your workspace survives browser restarts.",
    tag: "Data protection",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Report",
    subtitle: "Capture the problem at its source.",
    detail:
      "Inspect a water point, road culvert, or substation offline. Save a local draft or submit directly into the local sync queue.",
    icon: WifiOff,
  },
  {
    number: "02",
    title: "Synchronize",
    subtitle: "Keep every report connected.",
    detail:
      "Every report uses a stable UUID clientId so retries never create duplicates and failed attempts preserve local data safely.",
    icon: RefreshCw,
  },
  {
    number: "03",
    title: "Resolve",
    subtitle: "Turn reports into real action.",
    detail:
      "Dispatch teams review incoming reports, assign responsible units, monitor progress, and verify field completion.",
    icon: ShieldCheck,
  },
];

const MISSION_POINTS = [
  {
    title: "Designed for the field",
    text: "Capture important information where the problem actually happens.",
  },
  {
    title: "Built for continuity",
    text: "Keep working through network interruptions without losing reports.",
  },
  {
    title: "Focused on resolution",
    text: "Give coordinators the visibility to assign, track, and resolve issues.",
  },
];

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

export function Landing() {
  const shouldReduceMotion = useReducedMotion();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-[#EFEEEC] text-[#0A0A0A]">
      {/* HERO */}
      <section
        id="home"
        className="cinematic-hero relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0A0A0A] text-[#EFEEEC]"
      >
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-black/55"
          aria-hidden="true"
        />

        <Navbar variant="cinematic" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12">
          <div className="w-full max-w-5xl text-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-6 font-cinematic-body text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F4B64F] sm:text-xs">
                Offline-first infrastructure operations
              </p>

              <h1 className="font-cinematic-display text-balance text-2xl leading-[0.98] tracking-tight text-[#EFEEEC] sm:text-6xl md:text-7xl lg:text-[6.5rem]">
                Infrastructure never waits.
                <span className="mt-2 block italic text-[#F4B64F]">
                  Neither should your teams.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-8 max-w-2xl font-cinematic-body text-sm font-medium leading-7 text-[#EFEEEC]/90 sm:text-base sm:leading-8"
            >
              Capture field issues anywhere, synchronize when connectivity
              returns, and move infrastructure problems from first report to
              verified resolution.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#F4B64F] px-7 py-3 font-cinematic-body text-sm font-bold text-[#0A0A0A] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-[#BE732F]"
              >
                Begin Reporting
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#EFEEEC]/50 bg-black/20 px-7 py-3 font-cinematic-body text-sm font-semibold text-[#EFEEEC] transition duration-300 hover:border-[#F4B64F] hover:text-[#F4B64F]"
              >
                Explore the Platform
              </button>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-[#EFEEEC]/25 pt-7 font-cinematic-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[#EFEEEC] sm:text-xs"
            >
              <span className="inline-flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-[#F4B64F]" />
                Works Offline
              </span>
              <span className="inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-[#F4B64F]" />
                Automatic Sync
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#F4B64F]" />
                Reliable Reporting
              </span>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 px-5 pb-6 font-cinematic-body text-[9px] font-semibold uppercase tracking-[0.18em] text-[#EFEEEC] sm:px-8 sm:pb-8 sm:text-[10px] lg:px-12">
          <span>Offline Field Issue Tracker</span>
          <button
            type="button"
            onClick={scrollToFeatures}
            className="inline-flex items-center gap-2 transition-colors hover:text-[#F4B64F]"
          >
            Discover More
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="scroll-mt-20 relative overflow-hidden bg-[#EFEEEC] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 grid gap-6 md:grid-cols-2 md:items-end"
          >
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#BE732F]">
                <span className="h-px w-8 bg-[#BE732F]" />
                Core capabilities
              </p>

              <h2 className="max-w-xl font-display text-3xl font-bold leading-tight tracking-tight text-[#0A0A0A] sm:text-5xl">
                Built for the realities of field operations.
              </h2>
            </div>

            <p className="max-w-lg text-sm leading-7 text-[#552F0B]/75 md:justify-self-end md:text-base">
              From the first field observation to final resolution, every
              capability is designed to keep your teams informed and your
              reports safe.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;

              return (
                <motion.article
                  key={feat.number}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : idx * 0.07,
                  }}
                  className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-[#552F0B]/15 bg-[#0A0A0A] p-6 shadow-[0_8px_30px_rgba(10,10,10,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F4B64F]/60 hover:shadow-[0_18px_45px_rgba(10,10,10,0.18)] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4B64F]/10 text-[#F4B64F] transition-all duration-300 group-hover:bg-[#F4B64F] group-hover:text-[#0A0A0A]">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <span className="font-mono text-xs font-semibold tracking-wider text-[#EFEEEC]/35">
                      {feat.number}
                    </span>
                  </div>

                  <div className="mt-8">
                    <span className="inline-flex rounded-full border border-[#F4B64F]/25 bg-[#F4B64F]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F4B64F]">
                      {feat.tag}
                    </span>

                    <h3 className="mt-4 font-display text-xl font-bold text-[#EFEEEC]">
                      {feat.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#EFEEEC]/65">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full border border-[#F4B64F]/10 transition-transform duration-500 group-hover:scale-150" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-20 relative overflow-hidden border-y border-[#F4B64F]/10 bg-[#0A0A0A] py-20 text-[#EFEEEC] sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F4B64F]">
                <span className="h-px w-8 bg-[#F4B64F]" />A simple workflow
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#EFEEEC] sm:text-5xl">
                From a field report to a resolved issue.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#EFEEEC]/60">
              A connected workflow that keeps field workers and coordinators
              moving in the same direction.
            </p>
          </motion.div>

          <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-[#F4B64F]/10 via-[#F4B64F]/60 to-[#F4B64F]/10 md:block" />

            {STEPS.map((step, idx) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : idx * 0.12,
                  }}
                  className="relative"
                >
                  <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-[#F4B64F]/30 bg-[#552F0B] text-[#F4B64F] shadow-[0_0_35px_rgba(244,182,79,0.08)]">
                    <Icon className="h-7 w-7" strokeWidth={1.6} />
                  </div>

                  <p className="mt-8 font-mono text-xs font-semibold tracking-[0.2em] text-[#F4B64F]">
                    STEP {step.number}
                  </p>

                  <h3 className="mt-3 font-display text-2xl font-bold text-[#EFEEEC]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-[#EFEEEC]/85">
                    {step.subtitle}
                  </p>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-[#EFEEEC]/60">
                    {step.detail}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-5 border-t border-[#EFEEEC]/10 pt-8 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-6 text-[#EFEEEC]/60">
              Every report remains safely stored locally while waiting for a
              connection.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-3 rounded-full bg-[#F4B64F] px-6 py-3 text-sm font-bold text-[#0A0A0A] transition-all duration-300 hover:bg-[#BE732F]"
            >
              Start reporting
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-20 overflow-hidden bg-[#EFEEEC] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#BE732F]">
                <span className="h-px w-8 bg-[#BE732F]" />
                About the project
              </p>

              <h2 className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[#0A0A0A] sm:text-5xl">
                Infrastructure deserves better than disconnected workflows.
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#552F0B]/80">
                Field teams work in places where reliable internet is not always
                available. Yet infrastructure problems still need to be
                reported, tracked, and resolved.
              </p>

              <p className="mt-4 max-w-xl text-base leading-8 text-[#552F0B]/80">
                Offline Field Issue Tracker bridges that gap with dependable
                local reporting, automatic synchronization, and a coordinated
                issue management workflow.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 rounded-full bg-[#0A0A0A] px-7 py-3.5 text-sm font-semibold text-[#F4B64F] transition-all duration-300 hover:bg-[#552F0B]"
                >
                  Get Started
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 rounded-full border border-[#552F0B]/25 bg-transparent px-7 py-3.5 text-sm font-semibold text-[#552F0B] transition-all duration-300 hover:border-[#BE732F] hover:bg-[#F4B64F]/15"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-[#F4B64F]/20 bg-[#0A0A0A] p-8 text-[#EFEEEC] shadow-[0_25px_70px_rgba(10,10,10,0.18)] sm:p-10">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#F4B64F]/10" />
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#F4B64F]/10" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-[#EFEEEC]/10 pb-7">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4B64F]">
                        Our mission
                      </p>

                      <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                        Reliable operations. Wherever the work happens.
                      </h3>
                    </div>

                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4B64F]/10 text-[#F4B64F] sm:flex">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="space-y-6 py-8">
                    {MISSION_POINTS.map((item, idx) => (
                      <div key={item.title} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F4B64F]/25 bg-[#552F0B] font-mono text-xs font-bold text-[#F4B64F]">
                          0{idx + 1}
                        </span>

                        <div>
                          <h4 className="text-sm font-bold text-[#EFEEEC]">
                            {item.title}
                          </h4>

                          <p className="mt-1 text-sm leading-6 text-[#EFEEEC]/60">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#EFEEEC]/10 pt-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#EFEEEC]/40">
                      Developed by
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#F4B64F]">
                      Seid Jemal
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
