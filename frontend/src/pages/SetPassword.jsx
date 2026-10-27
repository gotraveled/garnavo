import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { LockKey, CheckCircle } from "@phosphor-icons/react";

export default function SetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (pw !== pw2) { toast.error("Passwords do not match."); return; }
    setSaving(true);
    try {
      const r = await api.post("/auth/set-password", { token, password: pw });
      localStorage.setItem("gnv_customer_token", r.data.token);
      setDone(true);
      setTimeout(() => window.location.assign("/account"), 1500);
    } catch (e2) {
      toast.error(e2?.response?.data?.detail || "Could not set password. The link may have expired.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-14">
      <SEO title="Set Password | Garnavo" noindex />
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8">
        {!token ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">Invalid link</h1>
            <p className="mt-2 text-sm text-neutral-600">This password link is missing or malformed. Request a new one from the sign-in page.</p>
            <Link to="/account" className="btn-primary mt-6 inline-block">Go to sign in</Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle size={48} weight="duotone" className="mx-auto text-emerald-600" />
            <h1 className="mt-3 font-display text-2xl font-bold">Password set</h1>
            <p className="mt-2 text-sm text-neutral-600">Taking you to your account…</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2"><LockKey size={22} weight="duotone" /><h1 className="font-display text-2xl font-bold">Set your password</h1></div>
            <p className="mt-2 text-sm text-neutral-600">Choose a password to access your Garnavo dashboard — your license keys and orders are waiting.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">New password</label>
                <input
                  data-testid="set-password-input"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">Confirm password</label>
                <input
                  data-testid="set-password-confirm-input"
                  type="password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40"
                />
              </div>
              <button data-testid="set-password-submit" type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? "Setting password..." : "Set password & sign in"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
