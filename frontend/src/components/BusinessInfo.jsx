import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  BUSINESS_ADDRESS,
} from "@/lib/business";

/**
 * Shared "contact the business" block used at the bottom of policy pages.
 * Renders the legal name, full address, email and (when configured) phone —
 * keeping every policy page consistent with the business details Google
 * Merchant Center checks.
 */
export default function BusinessContactBlock({ team }) {
  return (
    <p className="rounded-md border border-neutral-200 bg-neutral-50 p-3 font-medium text-neutral-800">
      <strong>{team ? `${BUSINESS_LEGAL_NAME} — ${team}` : BUSINESS_LEGAL_NAME}</strong><br />
      {BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.city}, {BUSINESS_ADDRESS.region}, {BUSINESS_ADDRESS.postalCode}, {BUSINESS_ADDRESS.countryShort}<br />
      Email: <a href={`mailto:${BUSINESS_EMAIL}`} className="underline">{BUSINESS_EMAIL}</a>
      {BUSINESS_PHONE && (
        <>
          <br />Phone: <a href={BUSINESS_PHONE_HREF} className="underline">{BUSINESS_PHONE}</a>
        </>
      )}
    </p>
  );
}
