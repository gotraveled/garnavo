import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { Envelope, ChatCircle, MapPin, Phone } from "@phosphor-icons/react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formStartTime] = useState(Date.now());
  
  const submit = async (e) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's a bot
    if (form.honeypot) {
      toast.error("Submission failed", { description: "Please try again." });
      return;
    }
    
    // Time-based check - must take at least 3 seconds to submit
    const timeElapsed = Date.now() - formStartTime;
    if (timeElapsed < 3000) {
      toast.error("Please slow down", { description: "Submit too quickly. Please wait and try again." });
      return;
    }
    
    // Basic spam pattern detection
    const spamPatterns = [
      /http/i,
      /www\./i,
      /\.com/i,
      /\.org/i,
      /\.net/i,
      /viagra/i,
      /casino/i,
      /bitcoin/i,
      /crypto/i,
      /investment/i,
      /loan/i,
      /credit/i,
      /debt/i
    ];
    
    const messageLower = form.message.toLowerCase();
    const isSpam = spamPatterns.some(pattern => pattern.test(messageLower));
    
    if (isSpam) {
      toast.error("Message blocked", { description: "Your message appears to contain spam content." });
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post("/contact", { name: form.name, email: form.email, message: form.message });
      toast.success("Message sent!", { description: "We'll reply within 12 hours." });
      setForm({ name: "", email: "", message: "", honeypot: "" });
    } catch (error) {
      toast.error("Failed to send message", { description: "Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Garnavo",
      "url": "https://garnavo.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@garnavo.com",
        "availableLanguage": "English",
        "areaServed": "US"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Westwood Street",
        "addressLocality": "Hayward",
        "addressRegion": "CA",
        "postalCode": "94544",
        "addressCountry": "US"
      }
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Garnavo"
        description="Reach the Garnavo team for order help, license questions, or activation support — most messages answered within 12 hours."
        keywords="Contact Garnavo, customer service, license inquiries, order inquiry, activation service, contact"
        schema={[contactSchema]}
      />
      <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Contact</div>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Talk to a real person</h1>
        <p className="mt-3 max-w-2xl text-neutral-600">Order hiccup, activation question, or just curious about a plan? Drop us a line and we'll get back to you, usually same day.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          {/* Left column: contact channels */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#FF6B45]/10 text-[#FF6B45]"><Envelope size={20} weight="duotone" /></div>
              <div className="mt-3 font-display font-semibold">Email us</div>
              <a href="mailto:info@garnavo.com" className="text-sm font-medium text-neutral-900 hover:underline">info@garnavo.com</a>
              <p className="mt-1 text-xs text-neutral-500">Fastest way to reach us — include your order number if you have one.</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#FF6B45]/10 text-[#FF6B45]"><MapPin size={20} weight="duotone" /></div>
              <div className="mt-3 font-display font-semibold">Registered address</div>
              <div className="text-sm text-neutral-600">Westwood Street,<br />Hayward, California, 94544<br />United States</div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-[#101826] p-6 text-white">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-[#FF9776]"><ChatCircle size={20} weight="duotone" /></div>
              <div className="mt-3 font-display font-semibold">Response time</div>
              <div className="text-sm text-neutral-300">Most messages answered same day — under 12 hours guaranteed.</div>
            </div>
          </div>

          {/* Right column: form */}
          <form onSubmit={submit} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 md:p-8 lg:col-span-3">
          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ display: 'none' }}>
            <label htmlFor="honeypot">Leave this field empty</label>
            <input
              id="honeypot"
              type="text"
              value={form.honeypot}
              onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="contact-name-input" className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="contact-email-input" className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} data-testid="contact-message-input" className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40" />
          </div>
          <button data-testid="contact-submit-btn" type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </button>
          <p className="text-xs text-neutral-500">By contacting us you agree to our <a href="/privacy-policy" className="underline">Privacy Policy</a>. We only use your details to reply to your inquiry.</p>
        </form>
        </div>

        {/* SEO Content */}
        <div className="mt-16 rounded-xl border border-neutral-200 bg-neutral-50 p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Why Contact Us?</div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Activation service</h2>
          
          <div className="mt-6 space-y-4 text-neutral-700">
            <p>
              Our team specializes in antivirus activation and provides guidance across the brands we carry. Whether you're activating a license, installing the software, or have a subscription question, we're here for you.
            </p>
            
            <h3 className="font-display text-lg font-semibold text-neutral-900">Common reasons to contact us:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>License activation service</li>
              <li>Installation guidance for your security software</li>
              <li>Subscription questions</li>
              <li>Order status and delivery inquiries</li>
              <li>Refund and replacement requests</li>
              <li>Product recommendations and upgrades</li>
              <li>Multi-device activation service</li>
            </ul>
            
            <p>
              We respond to all inquiries within 12 hours, with most questions answered on the same day. Our team has hands-on experience across the security brands we carry and can get your devices protected quickly and efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
