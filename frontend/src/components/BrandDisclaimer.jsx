import { ShieldCheck } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function BrandDisclaimer({ variant = "footer" }) {
  const wrapper =
    variant === "light"
      ? "bg-transparent text-neutral-400"
      : variant === "footer"
      ? "border-t border-neutral-200 bg-neutral-100 text-neutral-600"
      : "bg-neutral-50 border-b border-neutral-200 text-neutral-500";
  return (
    <div data-testid="brand-disclaimer" className={wrapper}>
      <div className={`container-page py-3 ${variant === "light" ? "text-[10px]" : "text-[11px]"} leading-relaxed`}>
        <div className="flex items-start gap-2">
          <ShieldCheck size={13} weight="duotone" className={`mt-0.5 shrink-0 ${variant === "light" ? "text-neutral-400" : "text-neutral-500"}`} />
          <p>
            Garnavo is an independent digital software reseller and is not affiliated with, endorsed by, sponsored by, or officially connected to NortonLifeLock / Gen Digital Inc., Webroot / OpenText, McAfee LLC, or any of their subsidiaries or affiliates. Norton®, Webroot® and McAfee® are registered trademarks of their respective owners. All company, product and service names used on this website are for identification purposes only and do not imply endorsement. Read our full <Link to="/disclaimer" className="underline hover:text-neutral-600">Disclaimer</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
