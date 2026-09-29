import { ShieldCheck, LockKey, Envelope, CreditCard, CheckCircle } from "@phosphor-icons/react";

export function TrustMarquee() {
  const items = [
    "Licenses verified before sale",
    "Inbox delivery in 5–15 min",
    "Encrypted PayPal checkout",
    "30-day replacement guarantee",
    "Independently operated",
    "Free activation walkthrough",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="border-y border-neutral-200 bg-[#101826] py-3">
      <div className="marquee-container">
        <div className="marquee-track">
          {doubled.map((t, i) => (
            <div key={i} className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#FF9776]">
              <ShieldCheck size={16} weight="fill" /> <span className="text-neutral-100">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrustBadges() {
  const badges = [
    { icon: <ShieldCheck size={22} weight="duotone" />, title: "Checked before it's listed", desc: "Every key is verified unused before it ever reaches the catalog." },
    { icon: <Envelope size={22} weight="duotone" />, title: "Straight to your inbox", desc: "No download portal to hunt for — the key just arrives by email." },
    { icon: <LockKey size={22} weight="duotone" />, title: "PayPal-only checkout", desc: "Your payment details stay with PayPal, never with us." },
    { icon: <CheckCircle size={22} weight="duotone" />, title: "30-day backup plan", desc: "Doesn't activate? We replace it or refund you, no hassle." },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((b, i) => (
        <div key={i} data-testid={`trust-badge-${i}`} className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="text-neutral-900">{b.icon}</div>
          <div className="mt-3 font-display text-base font-semibold">{b.title}</div>
          <div className="mt-1 text-sm text-neutral-600">{b.desc}</div>
        </div>
      ))}
    </div>
  );
}

export function IconBadge({ children }) {
  return <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#101826] text-[#FF9776]">{children}</div>;
}

export { CreditCard };
