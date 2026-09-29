import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import ProductCard from "@/components/ProductCard";
import LoadError from "@/components/LoadError";
import BrandDisclaimer from "@/components/BrandDisclaimer";
import { getBrand, BRAND_LIST } from "@/lib/brands";
import { ShieldCheck, ArrowRight, CheckCircle, Envelope, LockKey, Headset, CreditCard, Lightning, DownloadSimple, Certificate, Package } from "@phosphor-icons/react";

export default function CategoryPage() {
  const { category } = useParams();
  const brand = getBrand(category);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const productsRef = useRef(null);

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const load = () => {
    if (!brand) { setLoading(false); return; }
    setLoading(true);
    setError(false);
    api.get("/products", { params: { brand: brand.name } })
      .then((r) => setProducts(r.data))
      .catch(() => { setProducts([]); setError(true); })
      .finally(() => setLoading(false));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [category]);

  // Unknown brand -> friendly fallback
  if (!brand) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Category not found</h1>
        <p className="mt-3 text-neutral-600">Browse our security software by brand:</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {BRAND_LIST.map((b) => (
            <Link key={b.slug} to={`/category/${b.slug}`} className="btn-outline">{b.name}</Link>
          ))}
        </div>
      </div>
    );
  }

  const theme = {
    "--brand": brand.accent,
    "--brand-dark": brand.accentDark,
    "--brand-text": brand.accentTextOn,
    "--brand-soft": brand.accentSoft,
    "--brand-softer": brand.accentSoftAlt,
    "--brand-border": brand.accentBorder,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://garnavo.com" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://garnavo.com/products" },
      { "@type": "ListItem", "position": 3, "name": brand.heroTitle, "item": `https://garnavo.com/category/${brand.slug}` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": brand.heroTitle,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "url": `https://garnavo.com/product/${p.slug}`,
    })),
  };

  return (
    <>
      <SEO
        title={brand.seoTitle}
        description={brand.seoDesc}
        keywords={brand.seoKeywords}
        schema={[breadcrumbSchema, itemListSchema]}
      />
      <div style={theme} className="bg-white">
        {/* Slim landing hero — products visible on open */}
        <section className="border-b border-neutral-200 brand-bg-softer">
          <div className="container-page py-8 md:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 text-sm text-neutral-500">
                  <Link to="/products" className="hover:text-neutral-900">Products</Link>
                  <span className="mx-1.5">/</span>
                  <span className="text-neutral-900">{brand.name}</span>
                </div>
                <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-4xl">
                  {brand.heroTitle}
                </h1>
                <div className="mt-2 h-1.5 w-20 rounded-full brand-underline" />
                <p className="mt-3 text-base leading-relaxed text-neutral-700">{brand.heroSub}</p>
              </div>
              {/* Two paths matching the ad groups: buy vs redeem/activate */}
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <button onClick={scrollToProducts} className="btn-brand">
                  Shop {brand.name} Products <ArrowRight size={18} weight="bold" />
                </button>
                <Link to={`/activation/${brand.slug}`} className="btn-outline justify-center">
                  {brand.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm">
            {[
              { icon: <ShieldCheck size={16} weight="duotone" className="brand-text" />, t: "Genuine, verified licenses" },
              { icon: <Envelope size={16} weight="duotone" className="brand-text" />, t: "Email delivery in 5–15 min" },
              { icon: <LockKey size={16} weight="duotone" className="brand-text" />, t: "Secure checkout" },
              { icon: <Headset size={16} weight="duotone" className="brand-text" />, t: "Activation service included" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 font-medium text-neutral-800">{b.icon}{b.t}</div>
            ))}
          </div>
        </section>

        {/* Independence notice — compliance, kept light */}
        <div className="container-page py-3">
          <p className="mx-auto max-w-3xl text-center text-[11px] leading-relaxed text-neutral-400">
            Independent reseller — not affiliated with or endorsed by {brand.entity}. Activation is completed on the
            official {brand.name} portal at{" "}
            <a href={brand.portalUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-600">{brand.portalName}</a>.
          </p>
        </div>

        {/* Products — the landing target for the purchase ad group */}
        <section ref={productsRef} className="container-page scroll-mt-24 py-8 md:py-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">{products.length} products</div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">Shop {brand.name}</h2>
            </div>
          </div>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-neutral-100" />
              ))}
            </div>
          ) : error ? (
            <LoadError label={`${brand.name} products`} onRetry={load} />
          ) : products.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 p-16 text-center text-neutral-600">
              No {brand.name} products found. <Link to="/products" className="font-semibold underline">Browse all products</Link>
            </div>
          )}
        </section>

        {/* Why buy from us — value cards */}
        <section className="border-t border-neutral-200 bg-white py-16">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Why Garnavo</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Why buy your {brand.name} license from us</h2>
              <p className="mt-3 text-neutral-600">We're an independent reseller focused on one thing: genuine licenses, delivered fast, at a fair price.</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Certificate size={24} weight="duotone" className="brand-text" />, t: "Genuine & verified", d: "Every license is sourced from vetted channels and checked before it's sent to you." },
                { icon: <Lightning size={24} weight="duotone" className="brand-text" />, t: "5–15 min delivery", d: "Your activation code is emailed to you within minutes of a successful checkout." },
                { icon: <CreditCard size={24} weight="duotone" className="brand-text" />, t: "Secure checkout", d: "Pay safely with PayPal. We never see or store your card details." },
                { icon: <Headset size={24} weight="duotone" className="brand-text" />, t: "Activation service", d: "Step-by-step activation service and a 30-day money-back guarantee on every order." },
              ].map((c, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-lg border bg-white brand-border">{c.icon}</div>
                  <div className="mt-4 font-display font-semibold text-neutral-900">{c.t}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How buying works */}
        <section className="border-t border-neutral-200 brand-bg-softer py-16">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Simple process</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">How buying works</h2>
              <p className="mt-3 text-neutral-600">From checkout to protection in three steps.</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
              {[
                { n: "1", icon: <Package size={22} weight="duotone" style={{ color: brand.accentTextOn }} />, t: "Pick your plan", d: `Choose the ${brand.name} product and device count that fits your needs, then check out securely with PayPal.` },
                { n: "2", icon: <Envelope size={22} weight="duotone" style={{ color: brand.accentTextOn }} />, t: "Get your license by email", d: "We verify your order and email your activation code — usually within 5–15 minutes." },
                { n: "3", icon: <DownloadSimple size={22} weight="duotone" style={{ color: brand.accentTextOn }} />, t: "Activate on the official site", d: `Enter your code at ${brand.portalName} to register the subscription to your own account and download the software.` },
              ].map((s, i) => (
                <div key={i} className="relative rounded-2xl border bg-white p-6 brand-border">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-lg brand-bg">{s.icon}</div>
                    <span className="font-mono text-sm text-neutral-400">0{s.n}</span>
                  </div>
                  <div className="mt-4 font-display font-semibold text-neutral-900">{s.t}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About + FAQ (compliant, informative content) */}
        <section className="border-t border-neutral-200 brand-bg-softer py-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl font-bold tracking-tight">About {brand.name} security</h2>
              <div className="mt-5 space-y-4 text-neutral-700">
                {brand.about.map((para, i) => <p key={i}>{para}</p>)}
              </div>

              {/* What you get */}
              <div className="mt-8 rounded-xl border bg-white p-6 brand-border">
                <div className="font-display font-semibold text-neutral-900">What you get with every order</div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    "A genuine, unused activation code",
                    "Delivery to your email in 5–15 min",
                    "Activation on the official brand site",
                    "Step-by-step activation service",
                    "30-day money-back guarantee",
                    "Replacement if your code doesn't work",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-emerald-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h3 className="font-display text-xl font-semibold">Frequently asked questions</h3>
                <div className="mt-4 space-y-3">
                  {brand.faqs.map((f, i) => (
                    <div key={i} className="rounded-xl border bg-white p-5 brand-border">
                      <div className="font-display font-semibold text-neutral-900">{f.q}</div>
                      <p className="mt-1.5 text-sm text-neutral-600">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-xl border bg-white p-6 brand-border">
                <div className="flex items-start gap-3">
                  <CheckCircle size={22} weight="duotone" className="mt-0.5 shrink-0 brand-text" />
                  <div>
                    <div className="font-display font-semibold">Activation service for {brand.name}</div>
                    <p className="mt-1 text-sm text-neutral-700">
                      Every order includes our activation service for licenses purchased from us.{" "}
                      <Link to={`/activation/${brand.slug}`} className="font-semibold underline brand-text">
                        Go to {brand.name} activation
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BrandDisclaimer />
      </div>
    </>
  );
}
