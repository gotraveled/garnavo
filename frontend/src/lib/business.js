/**
 * Single source of truth for business identity shown across the site.
 *
 * Google Merchant Center's misrepresentation checks compare these details
 * against the "Business information" settings in Merchant Center — they
 * must match exactly, so keep this file in sync with GMC.
 *
 * Business operates as a sole proprietorship under the trade name
 * "Garnavo" (no registered LLC), so the trade name is used as the
 * legal/billing name across the site and Merchant Center.
 */

export const BUSINESS_NAME = "Garnavo";
export const BUSINESS_LEGAL_NAME = "Garnavo";
export const BUSINESS_EMAIL = "info@garnavo.com";
export const BUSINESS_PHONE = "+1 (844) 966-7866";
export const BUSINESS_PHONE_HREF = BUSINESS_PHONE
  ? `tel:${BUSINESS_PHONE.replace(/[^+\d]/g, "")}`
  : "";

export const BUSINESS_ADDRESS = {
  street: "4500 Margalo Avenue",
  city: "Bakersfield",
  region: "California",
  regionShort: "CA",
  postalCode: "93313",
  country: "United States",
  countryShort: "US",
};

export const BUSINESS_ADDRESS_ONELINE =
  `${BUSINESS_ADDRESS.street}, ${BUSINESS_ADDRESS.city}, ` +
  `${BUSINESS_ADDRESS.region}, ${BUSINESS_ADDRESS.postalCode}, ${BUSINESS_ADDRESS.countryShort}`;

/** PostalAddress fragment for schema.org JSON-LD blocks. */
export const BUSINESS_POSTAL_SCHEMA = {
  "@type": "PostalAddress",
  streetAddress: BUSINESS_ADDRESS.street,
  addressLocality: BUSINESS_ADDRESS.city,
  addressRegion: BUSINESS_ADDRESS.regionShort,
  postalCode: BUSINESS_ADDRESS.postalCode,
  addressCountry: BUSINESS_ADDRESS.countryShort,
};

/** ContactPoint fragment for schema.org JSON-LD blocks. */
export const BUSINESS_CONTACT_SCHEMA = {
  "@type": "ContactPoint",
  contactType: "customer service",
  email: BUSINESS_EMAIL,
  ...(BUSINESS_PHONE ? { telephone: BUSINESS_PHONE } : {}),
  availableLanguage: "English",
  areaServed: "US",
};
