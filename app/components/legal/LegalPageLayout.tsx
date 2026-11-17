// app/components/legal/LegalPageLayout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Section = { id: string; label: string };

export default function LegalPageLayout({
  eyebrow,
  title,
  description,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: Section[];
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-[#272727]">
      <div className="mx-auto max-w-[1220px] px-6 pb-24 pt-16 sm:px-9 lg:pt-24">
        <header className="mb-14 max-w-[850px] border-b border-[#e9e9e9] pb-12">
          <p className="mb-5 font-[Manrope] text-xs font-bold uppercase tracking-[0.18em] text-[#777]">{eyebrow}</p>
          <h1 className="font-[Fraunces] text-5xl font-normal leading-tight tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-[670px] font-[Manrope] text-base leading-8 text-[#666]">{description}</p>
          <p className="mt-6 font-[Manrope] text-xs text-[#777]">Last updated: November 17, 2026</p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:self-start lg:sticky lg:top-28">
            <p className="mb-4 font-[Manrope] text-xs font-bold uppercase tracking-widest text-[#888]">On this page</p>
            <nav aria-label={title + " sections"} className="flex flex-col gap-1 border-l border-[#e9e9e9]">
              {sections.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="border-l-2 border-transparent py-2.5 pl-4 font-[Manrope] text-[13px] leading-5 text-[#6c6c6c] transition-colors hover:border-[#be1d51] hover:text-[#222]">
                  {label}
                </a>
              ))}
            </nav>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-1.5 font-[Manrope] text-sm font-semibold text-[#303030] hover:underline">
              Contact us <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </aside>
          <article className="min-w-0 max-w-[780px] space-y-11 font-[Manrope] text-[15px] leading-8 text-[#555] [&_a]:font-semibold [&_a]:text-[#292929] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-4 [&_h2]:font-[Fraunces] [&_h2]:text-[27px] [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-[#242424] [&_li]:pl-1 [&_p+p]:mt-3 [&_section]:scroll-mt-28 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </article>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-[#e9e9e9] pt-7 font-[Manrope] text-sm text-[#666]">
          <span>Shangazi Emma Claudine · Kigali, Rwanda</span>
          <div className="flex gap-6">
            <Link className="hover:text-[#222]" href="/terms">Terms</Link>
            <Link className="hover:text-[#222]" href="/privacy">Privacy</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
