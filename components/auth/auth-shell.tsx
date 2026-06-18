import type { ReactNode } from "react";
import Image from "next/image";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const trustSignals = [
  "Role-aware access for clinical teams",
  "OTP verification for sensitive workflows",
  "Built for patient and hospital operations",
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#F4FAFD] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex flex-col justify-between bg-[#123D5B] px-6 py-8 text-white sm:px-10 lg:px-12">
          <div className="w-fit">
            <Image
              alt="Care Sync"
              height={48}
              priority
              src="/caresync.svg"
              width={162}
            />
          </div>

          <div className="my-14 max-w-xl lg:my-0">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#85C9F0]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#D8EEF8]">
              {description}
            </p>
          </div>

          <div className="grid gap-3 text-sm text-[#E7F7F2]">
            {trustSignals.map((item) => (
              <div
                className="flex items-center gap-3 rounded-lg border border-[#4EC3A0]/25 bg-white/5 px-4 py-3"
                key={item}
              >
                <span className="size-2 rounded-full bg-[#4EC3A0]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md rounded-lg border border-[#CFE8F5] bg-white p-6 shadow-sm shadow-[#1A6FA8]/10 sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
