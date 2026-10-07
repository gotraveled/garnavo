import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadError from "@/components/LoadError";
import SEO from "@/components/SEO";
import { TrustBadges, TrustMarquee } from "@/components/Trust";
import { BRAND_LIST } from "@/lib/brands";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_EMAIL,
  BUSINESS_POSTAL_SCHEMA,
  BUSINESS_CONTACT_SCHEMA,
} from "@/lib/business";
import { ShieldCheck, LockKey, Envelope, CreditCard, Lightning, ArrowRight, CheckCircle } from "@phosphor-icons/react";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [featuredError, setFeaturedError] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const loadFeatured = () => {
    setFeaturedLoading(true);
    setFeaturedError(false);
    api.get("/products", { params: { featured: true } })
      .then((r) => setFeatured(r.data))
      .catch(() => setFeaturedError(true))
      .finally(() => setFeaturedLoading(false));
  };
  useEffect(loadFeatured, []);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Garnavo",
    "url": "https://garnavo.com",
    "description": "Shop genuine antivirus subscription licenses, delivered straight to your inbox with secure checkout and a 30-day guarantee.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://garnavo.com/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Garnavo",
    "legalName": BUSINESS_LEGAL_NAME,
    "url": "https://garnavo.com",
    "logo": "https://garnavo.com/logo.png",
    "email": BUSINESS_EMAIL,
    "description": "Garnavo is an independently run online shop for genuine antivirus subscription licenses, with same-day email delivery and a real human behind every order.",
    "address": BUSINESS_POSTAL_SCHEMA,
    "contactPoint": BUSINESS_CONTACT_SCHEMA
  };

  return (
    <>
      <SEO
        title="Genuine Antivirus Protection Plans, Delivered Instantly | Garnavo"
        description="Garnavo sells genuine, ready-to-activate antivirus subscription licenses from leading security publishers. Email delivery in 5–15 minutes, encrypted checkout, 30-day guarantee."
        keywords="antivirus subscription, genuine antivirus license, buy antivirus online, internet security plan, email delivery"
        schema={[homeSchema, organizationSchema]}
      />
      <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div className="container-page grid gap-12 py-12 md:grid-cols-2 md:py-20">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
              <ShieldCheck size={14} weight="fill" className="text-teal-600" /> Independently run · Licenses verified before sale
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Genuine licenses.<br />
              <span className="relative inline-block">
                <span className="relative z-10">Delivered by email.</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-[#FF6B45]/15" aria-hidden />
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-700">
              Shop verified antivirus subscription licenses from top publishers. Every key is checked before delivery — straight to your inbox, typically within 5–15 minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/products" data-testid="hero-shop-btn" className="btn-dark">
                Browse the catalog <ArrowRight size={18} weight="bold" />
              </Link>
              <Link to="/activation" data-testid="hero-activate-btn" className="btn-outline">Activate Your License</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5 text-sm text-neutral-700"><CheckCircle size={16} weight="fill" className="text-teal-600" /> 30-day replacement guarantee</div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-700"><LockKey size={16} weight="fill" className="text-teal-600" /> Encrypted PayPal checkout</div>
            </div>
          </div>

          {/* Hero visual: 3 brand tiles */}
          <div className="relative flex items-center">
            <div className="grid w-full gap-4 sm:grid-cols-3">
              {BRAND_LIST.map((b, i) => (
                <Link
                  key={b.slug}
                  to={`/category/${b.slug}`}
                  className="group flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ marginTop: i === 1 ? "0" : "1.5rem" }}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-xl text-white" style={{ backgroundColor: b.accent, color: b.accentTextOn }}>
                    <ShieldCheck size={26} weight="fill" />
                  </div>
                  <div className="mt-3 font-display text-lg font-bold">{b.name}</div>
                  <div className="mt-1 text-xs text-neutral-500">Genuine licenses</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: b.accent }}>
                    Shop now <ArrowRight size={12} weight="bold" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg">
              <LockKey size={16} weight="duotone" />
              <span className="text-xs font-semibold">Email delivery · 5–15 min</span>
            </div>
          </div>
        </div>
      </section>

      <TrustMarquee />

      {/* SHOP BY BRAND */}
      <section className="container-page py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Pick your protection</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Three brands worth trusting</h2>
          <p className="mt-4 text-neutral-600">Every license is verified before it's listed — pick the brand that fits how you use your devices.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BRAND_LIST.map((b) => (
            <Link
              key={b.slug}
              to={`/category/${b.slug}`}
              data-testid={`brand-card-${b.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.18)]"
            >
              <div className="h-2 w-full" style={{ backgroundColor: b.accent }} />
              <div className="p-7">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ backgroundColor: b.accent, color: b.accentTextOn }}>
                    <ShieldCheck size={24} weight="fill" />
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">{b.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{b.tagline}.</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: b.accent }}>
                  Browse {b.name} products <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-20 md:py-24">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Customer favorites</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">What people are buying this week</h2>
            </div>
            <Link to="/products" className="hidden text-sm font-semibold text-neutral-700 hover:text-neutral-900 md:inline-flex md:items-center md:gap-1">View all <ArrowRight size={16} /></Link>
          </div>
          {featuredLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-neutral-100" />)}
            </div>
          ) : featuredError ? (
            <LoadError label="featured products" onRetry={loadFeatured} />
          ) : featured.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((p) => (<ProductCard key={p.id} product={p} />))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-600">
              No featured products right now. <Link to="/products" className="font-semibold underline">Browse all products</Link>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-page py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">From cart to protected</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Four steps, no waiting around</h2>
          <p className="mt-4 text-neutral-600">No accounts, no complicated setup — just a license that works.</p>
        </div>
        <div className="mt-10 md:mt-14 grid gap-4 md:gap-6 md:grid-cols-12">
          {[
            { n: "01", icon: <ShieldCheck size={24} weight="duotone" />, title: "Pick a plan", desc: "Match the brand, tier and number of devices to what you actually need.", span: "md:col-span-5" },
            { n: "02", icon: <CreditCard size={24} weight="duotone" />, title: "Pay through PayPal", desc: "Card or balance, fully encrypted. No login or account creation needed.", span: "md:col-span-7" },
            { n: "03", icon: <Envelope size={24} weight="duotone" />, title: "Watch your inbox", desc: "A human on our team checks and releases your license, typically within 5–15 minutes.", span: "md:col-span-7" },
            { n: "04", icon: <Lightning size={24} weight="duotone" />, title: "Activate & go", desc: "Redeem the code on the publisher's official site and you're covered immediately.", span: "md:col-span-5" },
          ].map((s) => (
            <div key={s.n} className={`${s.span} rounded-2xl border border-neutral-200 bg-white p-8`}>
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#101826] text-white">{s.icon}</div>
                <span className="font-mono text-sm text-neutral-500">{s.n}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-neutral-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">The Garnavo difference</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Built around getting it right</h2>
            </div>
          </div>
          <TrustBadges />
        </div>
      </section>

      {/* SEO CONTENT — multi-brand, compliant */}
      <section className="border-t border-neutral-200 bg-white py-20">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Behind the storefront</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Who we are and what we actually sell</h2>

            <div className="mt-8 space-y-6 text-neutral-700">
              <p>
                Garnavo is a small, independently operated shop for antivirus subscription licenses. We don't manufacture security software — we source genuine licenses through vetted channels, confirm each one works before it's listed, and email it to you once your order clears.
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-900">A range built for how you actually use your devices</h3>
              <p>
                Some plans focus on lightweight, cloud-based scanning that barely touches your system's resources. Others bundle a full suite — VPN, password manager, dark web monitoring, cloud backup and parental controls — for households running several phones, tablets and laptops at once. Browse the catalog to compare tiers and pick what fits.
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-900">Why people order from us more than once</h3>
              <p>
                No inflated renewal pricing, no upsell maze at checkout — just a verified license, delivered fast, backed by a 30-day replace-or-refund policy if something doesn't activate. We'll also walk you through setup if you get stuck.
              </p>

              <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={22} weight="duotone" className="mt-1 shrink-0 text-neutral-900" />
                  <div>
                    <div className="font-display font-semibold">We're a reseller, not the software maker</div>
                    <p className="mt-1 text-sm text-neutral-700">
                      Garnavo operates independently and has no affiliation, sponsorship or endorsement from the publishers of the security software listed in our catalog. Any brand names or marks that appear on individual product pages belong to their respective owners and are used solely to identify the genuine products available for purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-[#101826] py-20 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your devices, actually protected</h2>
            <p className="mt-2 max-w-xl text-neutral-300">Genuine antivirus licenses, verified and emailed fast, backed by a 30-day guarantee.</p>
          </div>
          <Link to="/products" data-testid="cta-shop-btn" className="btn-primary">See the full catalog <ArrowRight size={18} weight="bold" /></Link>
        </div>
      </section>
    </div>
    </>
  );
}
