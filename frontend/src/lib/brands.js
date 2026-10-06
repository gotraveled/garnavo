// Brand configuration for the 3 product lines.
// Each brand gets a white-majority page with a single accent color.
// No brand logos/wordmarks are used — only a generic shield + product name.

export const BRANDS = {
  norton: {
    slug: "norton",
    name: "Norton",
    // Yellow accent (Norton-inspired) — dark text reads best on it
    color: "#EAB308",
    colorDark: "#CA8A04",
    soft: "#FEF9C3",
    softAlt: "#FEFCE8",
    border: "#FDE047",
    textOn: "#1C1917", // dark text on yellow
    ring: "#EAB308",
    // Shifted accent — same hue family as the brand but visibly different
    // (deep amber/bronze, not the official yellow).
    accent: "#A16207",
    accentDark: "#7C4A03",
    accentTextOn: "#FFFFFF",
    accentSoft: "#F5ECD4",
    accentSoftAlt: "#FBF7EB",
    accentBorder: "#E2CE8B",
    entity: "NortonLifeLock / Gen Digital Inc.",
    portalName: "my.norton.com",
    portalUrl: "https://my.norton.com",
    ctaLabel: "Activate Your License",
    verbTitle: "Activate",
    verbIng: "activating",
    serviceName: "activation service",
    keyLabel: "Norton activation code (25 characters)",
    keyPlaceholder: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    keyHint: "Format: 25 alphanumeric characters, usually shown with dashes.",
    tagline: "Device security, VPN, and identity protection in one plan",
    heroTitle: "Norton Security Products",
    heroSub: "Genuine Norton licenses delivered to your email within minutes of checkout.",
    seoTitle: "Norton Licenses — Norton 360, AntiVirus & LifeLock",
    seoDesc: "Buy genuine Norton licenses. Norton 360 Deluxe, Premium, AntiVirus Plus & LifeLock with fast email delivery and a 30-day money-back guarantee.",
    seoKeywords: "Norton license, Norton 360 Deluxe, Norton AntiVirus Plus, Norton 360 Premium, Norton LifeLock, buy Norton online, genuine Norton software",
    steps: [
      { title: "Sign in to your account", desc: "Go to my.norton.com and sign in — create an account first if you don't have one yet." },
      { title: "Enter your 25-character product key", desc: "On your dashboard choose 'Enter a product key' and paste the key we emailed you." },
      { title: "Download and install", desc: "Follow the on-screen prompts to download the installer and complete setup on your device." },
      { title: "Run your first scan", desc: "Launch the app and run a full scan — your subscription is now active and your device is protected." },
    ],
    about: [
      "This brand is one of the most recognized names in consumer cybersecurity, offering layered protection against viruses, malware, ransomware and online threats. Its 360 plans add a Secure VPN, Password Manager, Dark Web Monitoring and cloud backup on top of core antivirus.",
      "When you buy a license from Garnavo, you receive a genuine activation code by email — usually within 5–15 minutes. Enter it at my.norton.com to register the subscription to your own account and download the software directly from the publisher.",
    ],
    faqs: [
      { q: "How do I activate my code?", a: "Sign in at my.norton.com, choose 'Enter a product key', paste your 25-character activation code, then download and install." },
      { q: "Is this a genuine license?", a: "Yes. Every code we sell is a genuine activation code that registers directly to your own account with the publisher." },
      { q: "How many devices can I protect?", a: "It depends on the plan — from a single PC up to 10 devices." },
      { q: "What if my code doesn't work?", a: "Contact us and we'll verify it or issue a replacement — covered by our 30-day money-back guarantee." },
    ],
  },

  webroot: {
    slug: "webroot",
    name: "Webroot",
    // Green accent (Webroot-inspired) — white text reads best on it
    color: "#16A34A",
    colorDark: "#15803D",
    soft: "#DCFCE7",
    softAlt: "#F0FDF4",
    border: "#86EFAC",
    textOn: "#FFFFFF",
    ring: "#16A34A",
    // Shifted accent — deep emerald/teal instead of Webroot's bright green.
    accent: "#047857",
    accentDark: "#065F46",
    accentTextOn: "#FFFFFF",
    accentSoft: "#D2EBDD",
    accentSoftAlt: "#EFFAF3",
    accentBorder: "#86C9A4",
    entity: "OpenText / Webroot Inc.",
    portalName: "webroot.com/safe",
    portalUrl: "https://www.webroot.com/safe",
    ctaLabel: "Activate Your License",
    verbTitle: "Activate",
    verbIng: "activating",
    serviceName: "activation service",
    keyLabel: "Webroot activation code (20 characters)",
    keyPlaceholder: "XXXX-XXXX-XXXX-XXXX-XXXX",
    keyHint: "Format: 20-character activation code found in your delivery email.",
    tagline: "Lightning-fast, cloud-based security that never slows you down",
    heroTitle: "Webroot Security Products",
    heroSub: "Genuine Webroot licenses delivered to your email within minutes of checkout.",
    seoTitle: "Webroot Licenses — Internet Security & AntiVirus",
    seoDesc: "Buy genuine Webroot licenses. Webroot Internet Security Complete, Plus & AntiVirus with fast email delivery and a 30-day money-back guarantee.",
    seoKeywords: "Webroot license, Webroot Internet Security Complete, Webroot AntiVirus, Webroot keycode, buy Webroot online, genuine Webroot software",
    steps: [
      { title: "Go to the install page", desc: "Visit webroot.com/safe on the device you want to protect, or sign in at my.webrootanywhere.com." },
      { title: "Enter your 20-character keycode", desc: "Type or paste the keycode we emailed you when prompted during setup." },
      { title: "Download and install", desc: "Run the small installer — it downloads in seconds and installs with minimal system impact." },
      { title: "First scan runs automatically", desc: "An initial scan runs automatically, then the app protects you in real time from the cloud." },
    ],
    about: [
      "This product line is a cloud-based security platform known for being extremely lightweight — scans complete in seconds and the software uses a fraction of the system resources of traditional antivirus. It protects against viruses, malware, ransomware, phishing and identity theft.",
      "When you buy a license from Garnavo, you receive a genuine 20-character keycode by email — usually within 5–15 minutes. Enter it at webroot.com/safe to activate and download the software directly from the publisher.",
    ],
    faqs: [
      { q: "How do I activate my code?", a: "Go to webroot.com/safe, enter your 20-character activation code, then download and run the installer. It takes just a couple of minutes." },
      { q: "Is this a genuine license?", a: "Yes. Every code we sell is a genuine activation code that registers directly with the publisher." },
      { q: "Does it slow down my PC?", a: "No — it's one of the lightest antivirus products available, with cloud-based scanning that uses minimal resources." },
      { q: "What if my code doesn't work?", a: "Contact us and we'll verify it or issue a replacement — covered by our 30-day money-back guarantee." },
    ],
  },

  mcafee: {
    slug: "mcafee",
    name: "Mcafee",
    // Red accent (Mcafee-inspired) — white text reads best on it
    color: "#DC2626",
    colorDark: "#B91C1C",
    soft: "#FEE2E2",
    softAlt: "#FEF2F2",
    border: "#FCA5A5",
    textOn: "#FFFFFF",
    ring: "#DC2626",
    // Shifted accent — deep wine/maroon instead of Mcafee's bright red.
    accent: "#9F1239",
    accentDark: "#7A0E2C",
    accentTextOn: "#FFFFFF",
    accentSoft: "#F5E0E6",
    accentSoftAlt: "#FBF0F3",
    accentBorder: "#E3A3B5",
    entity: "McAfee LLC",
    portalName: "mcafee.com/activate",
    portalUrl: "https://www.mcafee.com/activate",
    ctaLabel: "Redeem Your License",
    verbTitle: "Redeem",
    verbIng: "redeeming",
    serviceName: "redemption service",
    keyLabel: "Mcafee activation code (25 characters)",
    keyPlaceholder: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    keyHint: "Format: 25-character activation code from your delivery email.",
    tagline: "All-in-one protection for every device you own",
    heroTitle: "Mcafee Security Products",
    heroSub: "Genuine Mcafee licenses delivered to your email within minutes of checkout.",
    seoTitle: "Mcafee Licenses — Total Protection & Mcafee+",
    seoDesc: "Buy genuine Mcafee licenses. Mcafee Total Protection, Mcafee+ Premium & AntiVirus with fast email delivery and a 30-day money-back guarantee.",
    seoKeywords: "Mcafee license, Mcafee Total Protection, Mcafee+ Premium, Mcafee AntiVirus, Mcafee activation code, buy Mcafee online, genuine Mcafee software",
    steps: [
      { title: "Go to the redeem page", desc: "Visit mcafee.com/activate or sign in to your account at home.mcafee.com." },
      { title: "Enter your 25-character code", desc: "Paste the code we emailed you and sign in or create an account." },
      { title: "Download and install", desc: "Follow the prompts to download the installer and complete setup on your device." },
      { title: "Run protection and stay covered", desc: "Your subscription turns on and begins protecting your device in real time." },
    ],
    about: [
      "A long-standing leader in consumer security, this suite offers all-in-one protection that combines antivirus, a Secure VPN, identity monitoring, a password manager and privacy tools across PCs, Macs and mobile devices.",
      "When you buy a license from Garnavo, you receive a genuine 25-character code by email — usually within 5–15 minutes. Enter it at mcafee.com/activate to register the subscription to your own account and download the software directly from the publisher.",
    ],
    faqs: [
      { q: "How do I redeem my code?", a: "Go to mcafee.com/activate, enter your 25-character code, sign in or create an account, then download and install." },
      { q: "Is this a genuine license?", a: "Yes. Every code we sell is a genuine license code that registers directly to your own account with the publisher." },
      { q: "How many devices can I protect?", a: "It depends on the plan — from a single PC up to unlimited devices." },
      { q: "What if my code doesn't work?", a: "Contact us and we'll verify it or issue a replacement — covered by our 30-day money-back guarantee." },
    ],
  },
};

export const BRAND_LIST = [BRANDS.norton, BRANDS.webroot, BRANDS.mcafee];

export function getBrand(slug) {
  return BRANDS[slug] || null;
}
