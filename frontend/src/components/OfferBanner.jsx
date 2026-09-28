import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Envelope, Headset, X } from "@phosphor-icons/react";

export default function OfferBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div data-testid="offer-banner" className="relative bg-[#101826] text-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 py-2.5 text-xs md:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-neutral-200">
            <ShieldCheck size={14} weight="duotone" className="text-[#FF9776]" />
            Independent reseller — every license verified before delivery
          </span>
          <span className="hidden items-center gap-1.5 text-neutral-200 sm:inline-flex">
            <Envelope size={14} weight="duotone" className="text-[#FF9776]" />
            Email delivery in 5–15 minutes
          </span>
          <Link to="/contact" className="hidden items-center gap-1.5 text-neutral-200 hover:text-white md:inline-flex">
            <Headset size={14} weight="duotone" className="text-[#FF9776]" />
            Real human support, replies within 12h
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/track" className="rounded border border-white/20 px-2.5 py-1 font-semibold text-white hover:bg-white/10">
            Track order
          </Link>
          <button
            data-testid="offer-banner-close"
            onClick={() => setDismissed(true)}
            className="rounded p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
