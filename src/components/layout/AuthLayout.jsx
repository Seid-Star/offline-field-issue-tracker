import { Link } from "react-router-dom";

export function AuthLayout({ children, aside = null }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-0 sm:p-3 lg:p-5">
      <div
        className={`mx-auto grid min-h-[100svh] max-w-[1600px] grid-cols-1 overflow-hidden bg-[#EFEEEC] shadow-2xl sm:min-h-[calc(100svh-24px)] sm:rounded-[24px] lg:min-h-[calc(100svh-40px)] lg:rounded-[30px] ${
          aside ? "lg:grid-cols-[1.04fr_0.96fr]" : "lg:grid-cols-1"
        }`}
      >
        {aside && (
          <aside className="relative hidden min-h-[390px] overflow-hidden bg-[#0A0A0A] lg:block lg:min-h-[calc(100svh-40px)]">
            {aside}
          </aside>
        )}

        <main className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
