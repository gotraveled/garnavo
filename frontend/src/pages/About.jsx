import PolicyLayout, { Section } from "@/components/PolicyLayout";
import SEO from "@/components/SEO";
import { ShieldCheck, Envelope, MapPin, Phone, Users, Trophy, Handshake } from "@phosphor-icons/react";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  BUSINESS_POSTAL_SCHEMA,
} from "@/lib/business";

const SECTIONS = [
  { id: "mission", title: "Our mission" },
  { id: "story", title: "Our story" },
  { id: "values", title: "Our values" },
  { id: "how-we-work", title: "How we work" },
  { id: "why-us", title: "Why choose Garnavo" },
  { id: "contact", title: "Contact us" },
];

export default function About() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Garnavo",
      "legalName": BUSINESS_LEGAL_NAME,
      "url": "https://garnavo.com",
      "email": BUSINESS_EMAIL,
      "description": "An independent digital software reseller providing genuine antivirus subscription licenses — delivered fast, priced fairly, backed by responsive customer service.",
      "foundingDate": "2024",
      "address": BUSINESS_POSTAL_SCHEMA
    }
  };

  return (
    <>
      <SEO
        title="About Us | Garnavo - Independent Antivirus Reseller"
        description="Learn about Garnavo - an independent reseller of genuine antivirus subscription licenses with fast delivery, fair prices, and responsive customer service."
        keywords="About Garnavo, antivirus reseller, subscription license company, genuine software seller"
        schema={[aboutSchema]}
      />
      <PolicyLayout
        title="About Garnavo"
        subtitle="An independent digital software reseller providing genuine antivirus subscription licenses — delivered fast, priced fairly, backed by responsive customer service."
        lastUpdated="February 1, 2026"
        sections={SECTIONS}
      >
      <Section id="mission" title="Our mission">
        <p>Here's the problem Garnavo exists to fix: <strong>real security software shouldn't cost more than it needs to, and buying it shouldn't feel like navigating a maze.</strong></p>
        <p>Full-price antivirus renewals keep climbing, and publisher checkout flows are stuffed with add-ons you didn't ask for. Garnavo strips that down to the essentials — a genuine license for a brand you already trust, a fair price, delivery to your inbox in minutes, and a real person to talk to if something goes wrong.</p>
      </Section>

      <Section id="story" title="Our story">
        <p>Garnavo started as a side project among a handful of resellers and software specialists based in Bakersfield, California, after one too many conversations with family members baffled by surprise renewal charges and clunky installers from the big security vendors.</p>
        <p>We started with a single product line and a shared inbox. Since then we've expanded our catalog to cover several trusted security brands — spanning basic antivirus through full identity-protection suites — and now ship to customers across the country and beyond.</p>
      </Section>

      <Section id="values" title="Our values">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <ShieldCheck size={22} weight="duotone" className="text-neutral-900" />
            <div className="mt-3 font-display font-semibold">No shortcuts on authenticity</div>
            <p className="mt-1 text-sm text-neutral-700">We only stock licenses sourced through vetted digital channels. Nothing grey-market, nothing pirated.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <Users size={22} weight="duotone" className="text-neutral-900" />
            <div className="mt-3 font-display font-semibold">A person, not a bot</div>
            <p className="mt-1 text-sm text-neutral-700">Every message gets a reply from an actual team member, usually inside 12 hours, until your issue's resolved.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <Handshake size={22} weight="duotone" className="text-neutral-900" />
            <div className="mt-3 font-display font-semibold">Nothing hidden</div>
            <p className="mt-1 text-sm text-neutral-700">Pricing is upfront, our refund terms are posted in plain language, and our reseller status is disclosed on every page — not buried in fine print.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <Trophy size={22} weight="duotone" className="text-neutral-900" />
            <div className="mt-3 font-display font-semibold">Value that's actually fair</div>
            <p className="mt-1 text-sm text-neutral-700">We buy in volume from our supply partners and pass the bulk of that discount straight through to you.</p>
          </div>
        </div>
      </Section>

      <Section id="how-we-work" title="How we work">
        <p>We run lean on purpose. Skipping big ad budgets and unnecessary overhead means more of what you pay goes toward keeping prices competitive. Day to day, our focus stays narrow: source licenses we trust, keep checkout painless, and answer customer emails in hours rather than days.</p>
        <p>Before any license leaves our system, a member of our team manually reviews the order. That single check is what lets us stand behind every sale with a 30-day guarantee — if something doesn't work, we make it right.</p>
      </Section>

      <Section id="why-us" title="Why choose Garnavo">
        <ul className="list-disc pl-6">
          <li>Licenses sourced only through vetted digital supply channels</li>
          <li>Delivery to your email inbox, typically within 5–15 minutes of a confirmed payment</li>
          <li>Checkout runs through PayPal — your card details never touch our servers</li>
          <li>Free activation service through our <a href="/activation" className="underline">Activation Portal</a></li>
          <li>30-day guarantee: replacement or refund if a license won't activate</li>
          <li>Real replies at info@garnavo.com, not an auto-responder</li>
          <li>Coverage across several trusted security brands, spanning antivirus, VPN, and identity protection tiers</li>
        </ul>
      </Section>

      <Section id="contact" title="Contact us">
        <p className="rounded-md border border-neutral-200 bg-neutral-50 p-3 font-medium text-neutral-800">
          <MapPin size={16} weight="duotone" className="mr-1 inline align-text-bottom" />
          {BUSINESS_LEGAL_NAME}<br />
          {BUSINESS_POSTAL_SCHEMA.streetAddress}, {BUSINESS_POSTAL_SCHEMA.addressLocality}, {BUSINESS_POSTAL_SCHEMA.addressRegion === 'CA' ? 'California' : BUSINESS_POSTAL_SCHEMA.addressRegion}, {BUSINESS_POSTAL_SCHEMA.postalCode}, {BUSINESS_POSTAL_SCHEMA.addressCountry}<br />
          <Envelope size={16} weight="duotone" className="mr-1 inline align-text-bottom" />
          <a href={`mailto:${BUSINESS_EMAIL}`} className="underline">{BUSINESS_EMAIL}</a>
          {BUSINESS_PHONE && (
            <>
              <br />
              <Phone size={16} weight="duotone" className="mr-1 inline align-text-bottom" />
              <a href={BUSINESS_PHONE_HREF} className="underline">{BUSINESS_PHONE}</a>
            </>
          )}
        </p>
        <p>Order questions, activation requests, refund requests, press inquiries, or legal notices — send it all to the address above and expect a reply within 12 hours.</p>
      </Section>
    </PolicyLayout>
    </>
  );
}
