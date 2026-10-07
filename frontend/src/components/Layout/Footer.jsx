import { Link } from "react-router-dom";
import { MapPin, Envelope, Phone } from "@phosphor-icons/react";
import BrandDisclaimer from "@/components/BrandDisclaimer";
import { BRAND_LIST } from "@/lib/brands";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  BUSINESS_ADDRESS,
} from "@/lib/business";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container-page grid gap-10 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center">
            <img src="/logo.png" alt="Garnavo" className="h-10 w-auto rounded-lg" />
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
            An independent digital software reseller. Genuine antivirus subscription licenses with fast email delivery and a 30-day money-back guarantee.
          </p>
          <div className="mt-5 space-y-1.5 text-sm text-neutral-700">
            <div className="flex items-start gap-2">
              <MapPin size={16} weight="duotone" className="mt-0.5 shrink-0 text-neutral-500" />
              <span>{BUSINESS_LEGAL_NAME}<br />{BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.city},<br />{BUSINESS_ADDRESS.region}, {BUSINESS_ADDRESS.postalCode}, {BUSINESS_ADDRESS.countryShort}</span>
            </div>
            <div className="flex items-center gap-2">
              <Envelope size={16} weight="duotone" className="text-neutral-500" />
              <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-neutral-900">{BUSINESS_EMAIL}</a>
            </div>
            {BUSINESS_PHONE && (
              <div className="flex items-center gap-2">
                <Phone size={16} weight="duotone" className="text-neutral-500" />
                <a href={BUSINESS_PHONE_HREF} className="hover:text-neutral-900">{BUSINESS_PHONE}</a>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Shop by brand</div>
          <ul className="mt-4 space-y-2 text-sm">
            {BRAND_LIST.map((b) => (
              <li key={b.slug}>
                <Link to={`/category/${b.slug}`} className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.accent }} />
                  {b.name}
                </Link>
              </li>
            ))}
            <li><Link to="/products" className="text-neutral-700 hover:text-neutral-900">All Products</Link></li>
            <li><Link to="/activation" className="text-neutral-700 hover:text-neutral-900">Activation Service</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Resources</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/account" className="text-neutral-700 hover:text-neutral-900">My Account</Link></li>
            <li><Link to="/track" className="text-neutral-700 hover:text-neutral-900">Track Order</Link></li>
            <li><Link to="/digital-delivery" className="text-neutral-700 hover:text-neutral-900">How Digital Delivery Works</Link></li>
            <li><Link to="/faq" className="text-neutral-700 hover:text-neutral-900">FAQ</Link></li>
            <li><Link to="/contact" className="text-neutral-700 hover:text-neutral-900">Contact</Link></li>
            <li><Link to="/about" className="text-neutral-700 hover:text-neutral-900">About Us</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Legal</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="text-neutral-700 hover:text-neutral-900">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-neutral-700 hover:text-neutral-900">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="text-neutral-700 hover:text-neutral-900">Refund Policy</Link></li>
            <li><Link to="/disclaimer" className="text-neutral-700 hover:text-neutral-900">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <BrandDisclaimer />

      <div className="border-t border-neutral-200 bg-neutral-100">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-neutral-500 md:flex-row">
          <div>© {new Date().getFullYear()} {BUSINESS_LEGAL_NAME}. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-neutral-900">Privacy</Link>
            <Link to="/terms" className="hover:text-neutral-900">Terms</Link>
            <Link to="/disclaimer" className="hover:text-neutral-900">Disclaimer</Link>
            <Link to="/refund-policy" className="hover:text-neutral-900">Refunds</Link>
            <span>{BUSINESS_ADDRESS.city}, {BUSINESS_ADDRESS.regionShort}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
