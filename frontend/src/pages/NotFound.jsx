import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <SEO title="Page Not Found | Garnavo" noindex />
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-neutral-100 text-neutral-500">
        <MagnifyingGlass size={30} weight="duotone" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-neutral-600">
        The page you're looking for doesn't exist or may have moved. Try one of these instead:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/products" className="btn-primary">Browse products <ArrowRight size={16} weight="bold" /></Link>
        <Link to="/activation" className="btn-outline">Activate a license</Link>
        <Link to="/contact" className="btn-outline">Contact us</Link>
      </div>
    </div>
  );
}
