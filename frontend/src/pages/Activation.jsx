import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import BrandDisclaimer from "@/components/BrandDisclaimer";
import { BRAND_LIST } from "@/lib/brands";
import { ShieldCheck, ArrowRight, Clock, Headset } from "@phosphor-icons/react";

export default function Activation() {
  const pickerRef = useRef(null);

  // Landing page: show the 3 brand cards immediately on open
  useEffect(() => {
    const t = setTimeout(() => {
      pickerRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-neutral-50">
      <SEO
        title="Antivirus Activation Service | Garnavo"
        description="Activation service for antivirus licenses purchased from Garnavo, an independent reseller. Choose your brand for step-by-step activation."
        keywords="antivirus activation, license activation, activation service, independent reseller"
      />

      {/* Hero — compact so brand cards are visible on open */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="container-page py-8 md:py-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
            <Headset size={14} weight="fill" className="text-neutral-900" /> Garnavo activation service
          </div>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-4xl">
            Need your license activated, set up or installed?
          </h1>
          <div className="mx-auto mt-2 font-display text-lg font-semibold text-neutral-800 sm:text-xl">
            Activate your license
          </div>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-neutral-600">
            Pick the brand you purchased — our team walks you through activation on the official portal, usually within 5–15 minutes.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-neutral-400">
            We assist with activation, setup and installation for products purchased on our website.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[11px] leading-relaxed text-neutral-400">
            Garnavo is an independent reseller — not affiliated with the brands shown below. Activation is always completed on the brand's official website.
          </p>
        </div>
      </section>

      {/* Brand picker */}
      <section ref={pickerRef} className="container-page scroll-mt-24 py-8 md:py-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {BRAND_LIST.map((b) => (
            <Link
              key={b.slug}
              to={`/activation/${b.slug}`}
              data-testid={`activation-brand-${b.slug}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.18)]"
            >
              <div
                className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white"
                style={{ backgroundColor: b.accent, color: b.accentTextOn }}
              >
                <ShieldCheck size={30} weight="fill" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">{b.name}</h2>
              <p className="mt-2 text-sm text-neutral-600">{b.tagline}</p>
              <div
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#101826] px-5 py-2.5 text-sm font-semibold text-white transition-transform group-hover:scale-[1.03]"
              >
                Activate {b.name} <ArrowRight size={16} weight="bold" />
              </div>
            </Link>
          ))}
        </div>

        {/* Reassurance strip */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: <Clock size={22} weight="duotone" className="text-neutral-900" />, t: "5–15 min response", d: "Our team replies promptly during business hours." },
            { icon: <ShieldCheck size={22} weight="duotone" className="text-neutral-900" />, t: "Included with purchase", d: "Activation service is included for every license bought from us." },
            { icon: <Headset size={22} weight="duotone" className="text-neutral-900" />, t: "Guided setup", d: "Step-by-step guidance until you're protected." },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-lg bg-neutral-100">{x.icon}</div>
              <div className="mt-3 font-display font-semibold">{x.t}</div>
              <p className="mt-1 text-sm text-neutral-600">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <BrandDisclaimer variant="light" />
    </div>
  );
}
