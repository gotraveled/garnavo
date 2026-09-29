import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEO from "@/components/SEO";

const faqs = [
  { q: "How fast will my license actually show up?", a: "Typically 5–15 minutes after your payment clears. Every order gets a quick manual check on our end before it's released, and you'll get an email the moment it's sent." },
  { q: "Is what I'm buying legit, or some kind of workaround?", a: "Fully legit. Every license we sell is genuine and sourced through vetted partners, and you redeem it directly on the software publisher's own site." },
  { q: "Where do I actually enter the code?", a: "Each brand has its own activation portal. Our Activation page has step-by-step instructions for the exact brand you purchased, including which site to log into and how to redeem your code." },
  { q: "My license won't activate — now what?", a: "Reach out right away and we'll sort it out — either a replacement or a full refund, as long as it's within 30 days of your purchase." },
  { q: "Does one license cover more than one computer or phone?", a: "Depends on the plan you choose — some tiers cover a single device, others cover several, and a few are unlimited. Device limits are listed on each product page." },
  { q: "What's your refund policy?", a: "A straightforward 30-day guarantee — if it doesn't work or you're just not happy with it, we'll make it right." },
  { q: "Is it safe to pay on this site?", a: "Payments run entirely through PayPal's encrypted platform. Your card number never passes through our servers at any point." },
  { q: "Do I have to make an account to buy something?", a: "No account needed — checkout as a guest. We just need a valid email address to send your license to." },
  { q: "What antivirus brands can I get here?", a: "We carry a curated set of trusted security brands, spanning basic antivirus up through full internet security suites, VPN, and identity protection plans, all delivered instantly by email. See the full lineup on our Products page." },
  { q: "Can I bump my plan up to a bigger one later?", a: "Yes, upgrades happen directly through your account on the publisher's own site. Message us first if you want a hand picking the right tier." },
  { q: "Will this work if I'm outside the US?", a: "Yes, our licenses activate worldwide, though a handful of features can vary slightly by region depending on the publisher." },
  { q: "What can I pay with?", a: "PayPal balance, linked credit cards, or debit cards — all routed through PayPal's secure checkout, fully encrypted end to end." },
];

export default function FAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions | Garnavo"
        description="Straight answers on buying antivirus subscription licenses from Garnavo — delivery times, activation steps, refunds and payment security."
        keywords="antivirus FAQ, subscription license questions, activation service, refund policy, how to activate antivirus, license not working"
        schema={[faqSchema]}
      />
      <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Resources</div>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Questions, answered</h1>
        <p className="mt-3 text-neutral-600">The things people usually ask before (and after) ordering from us.</p>

        <Accordion type="single" collapsible className="mt-8 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0 px-4 sm:px-6">
              <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-left font-display text-sm font-semibold sm:text-base hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-neutral-600">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
    </>
  );
}
