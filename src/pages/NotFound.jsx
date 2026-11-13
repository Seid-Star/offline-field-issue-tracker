import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  FileSearch,
  MapPin,
} from "lucide-react";
import { Button } from "../components/common/Button.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";

export function NotFound() {
  return (
    <AppShell title="Page Not Found" breadcrumbs={[{ label: "404" }]}>
      <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center py-10">
        <section className="relative w-full overflow-hidden rounded-[30px] border border-[#BE732F]/20 bg-white px-6 py-12 text-center shadow-[0_16px_50px_rgba(85,47,11,0.07)] sm:px-12 sm:py-16">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#F4B64F]/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#BE732F]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full border border-[#BE732F]/10"
          />

          <div className="relative">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] border border-[#BE732F]/20 bg-[#F4B64F]/15 text-[#552F0B] shadow-[0_8px_24px_rgba(85,47,11,0.06)]">
              <div className="relative">
                <Compass className="h-10 w-10" strokeWidth={1.5} />
                <MapPin className="absolute -bottom-1 -right-2 h-5 w-5 fill-[#F4B64F] text-[#552F0B]" />
              </div>
            </div>

            {/* Error code */}
            <div className="mt-8">
              <p className="font-display text-[clamp(5rem,14vw,8rem)] font-black leading-none tracking-[-0.08em] text-[#0A0A0A]">
                404
              </p>

              <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-[#BE732F]/20 bg-[#EFEEEC] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F4B64F]" />
                <span className="text-[10px] font-bold tracking-[0.16em] text-[#552F0B]">
                  LOCATION NOT FOUND
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="mx-auto mt-6 max-w-md">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A] sm:text-3xl">
                Looks like you've taken a wrong turn.
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#552F0B]/65">
                The field operations page you're looking for doesn't exist or
                may have been moved. Your locally stored reports remain safe and
                accessible.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full">
                  <ArrowRight className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>

              <Link to="/reports" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  <FileSearch className="h-4 w-4" />
                  Browse Reports
                </Button>
              </Link>
            </div>

            <div className="mx-auto mt-9 flex items-center justify-center gap-2 border-t border-[#BE732F]/15 pt-5">
              <ArrowLeft className="h-3.5 w-3.5 text-[#BE732F]" />
              <p className="text-[10px] font-semibold tracking-[0.12em] text-[#552F0B]/50">
                OFFLINE-FIRST FIELD OPERATIONS
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
