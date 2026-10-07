import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { CheckCircle, Envelope, Clock, Package } from "@phosphor-icons/react";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const [order, setOrder] = useState(null);
  const id = params.get("id");
  const num = params.get("num");

  useEffect(() => {
    if (id) api.get(`/orders/${id}`).then((r) => setOrder(r.data)).catch(() => {});
  }, [id]);

  // Google Ads purchase conversion tracking
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-18497972963/XIDACP-m0ZQdEOPVwvRE",
        transaction_id: id || "",
      });
    }
  }, [id]);

  return (
    <div className="container-page py-20">
      <SEO title="Order Confirmed | Garnavo" noindex />
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle size={40} weight="duotone" />
        </div>
        <h1 data-testid="order-success-title" className="mt-6 font-display text-3xl font-bold sm:text-4xl">Payment received!</h1>
        <p className="mt-3 text-neutral-600">Thank you! Your order has been confirmed and is being processed by our team.</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 font-mono text-sm">
          Order number: <span data-testid="order-success-number" className="font-semibold">{num || order?.order_number}</span>
        </div>

        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-6 text-left">
          <div className="font-display font-semibold">What happens next?</div>
          <p className="mt-2 text-sm text-neutral-700">
            Our team is verifying your payment and will email your license(s) to <span className="font-semibold">{order?.customer_email || "your email"}</span> within <strong>5–15 minutes</strong>.
          </p>
          <p className="mt-3 text-sm text-neutral-700">
            <strong>Haven't received it after 30 minutes?</strong> Please check your spam/junk folder first — automated delivery emails sometimes land there. If it's still missing, call your account manager directly:
          </p>
          <div className="mt-4 flex flex-col items-start gap-3 rounded-lg border border-orange-300 bg-white p-4 sm:flex-row sm:items-center">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#101826] font-display text-sm font-bold text-[#FF9776]">KJ</div>
            <div>
              <div className="text-sm font-semibold text-neutral-900">Mr. Kevin Jense — Account Manager</div>
              <a href="tel:+18449667866" data-testid="success-support-phone" className="font-display text-lg font-bold text-[#FF6B45] hover:underline">+1 (844) 966-7866</a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-left">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#101826] text-[#FF9776]"><CheckCircle size={18} weight="duotone" /></div>
            <div className="mt-3 font-semibold">Payment received</div>
            <div className="mt-1 text-xs text-neutral-600">Confirmed via checkout</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-left">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#101826] text-[#FF9776]"><Clock size={18} weight="duotone" /></div>
            <div className="mt-3 font-semibold">Team verifying</div>
            <div className="mt-1 text-xs text-neutral-600">Typically 5–15 minutes</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-left">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#101826] text-[#FF9776]"><Envelope size={18} weight="duotone" /></div>
            <div className="mt-3 font-semibold">License delivered by email</div>
            <div className="mt-1 text-xs text-neutral-600">Check inbox & spam</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/track" data-testid="success-track-btn" className="btn-outline"><Package size={18} weight="duotone" /> Track order</Link>
          <Link to="/products" className="btn-primary">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
