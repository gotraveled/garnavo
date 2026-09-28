import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useCustomer } from "@/lib/auth";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { User, Package, Clock, SignOut, Envelope, MapPin, Phone, ShieldCheck, PencilSimple, Check, X } from "@phosphor-icons/react";

const statusMeta = {
  pending: { label: "Awaiting payment", color: "bg-neutral-100 text-neutral-700" },
  paid: { label: "Paid — preparing delivery", color: "bg-orange-100 text-orange-800" },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  refunded: { label: "Refunded", color: "bg-neutral-100 text-neutral-700" },
};

const inputCls = "mt-1 w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40";
const labelCls = "text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600";

function AuthForm() {
  const { login, register } = useCustomer();
  const nav = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email.trim(), form.password);
        toast.success("Welcome back!");
      } else {
        if (form.password.length < 8) {
          toast.error("Password must be at least 8 characters");
          setBusy(false);
          return;
        }
        await register({
          name: form.name.trim(), email: form.email.trim(), password: form.password,
          phone: form.phone.trim() || null, address: form.address.trim() || null,
        });
        toast.success("Account created — welcome to Garnavo!");
      }
      nav("/account");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">My account</div>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-3 text-neutral-600">
          {mode === "login"
            ? "Sign in to view your orders and delivered licenses in one place."
            : "Track orders and keep your delivered licenses in one place."}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 rounded-full border border-neutral-200 bg-neutral-100 p-1 text-sm font-semibold">
        <button onClick={() => setMode("login")} className={`rounded-full py-2.5 transition-colors ${mode === "login" ? "bg-[#101826] text-white" : "text-neutral-600 hover:text-neutral-900"}`}>Sign in</button>
        <button onClick={() => setMode("register")} className={`rounded-full py-2.5 transition-colors ${mode === "register" ? "bg-[#101826] text-white" : "text-neutral-600 hover:text-neutral-900"}`}>Create account</button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
        {mode === "register" && (
          <div>
            <label className={labelCls}>Full name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="account-name-input" className={inputCls} placeholder="John Smith" />
          </div>
        )}
        <div>
          <label className={labelCls}>Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="account-email-input" className={inputCls} placeholder="you@example.com" />
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="account-password-input" className={inputCls} placeholder={mode === "register" ? "At least 8 characters" : "Your password"} />
        </div>
        {mode === "register" && (
          <>
            <div>
              <label className={labelCls}>Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="account-phone-input" className={inputCls} placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} data-testid="account-address-input" className={inputCls} placeholder="Street, City, State, ZIP, Country" />
            </div>
          </>
        )}
        <button type="submit" disabled={busy} data-testid="account-submit-btn" className="btn-primary w-full">
          {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
        <p className="text-center text-xs text-neutral-500">
          {mode === "login" ? "No account yet? " : "Already have an account? "}
          <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold text-neutral-900 underline">
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </form>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-600">
        Ordered without an account? <Link to="/track" className="font-semibold text-neutral-900 underline">Track your order</Link> with your order number and email.
      </div>
    </div>
  );
}

function Dashboard() {
  const { customer, logout, updateProfile } = useCustomer();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    api.get("/auth/orders")
      .then((r) => setOrders(r.data))
      .catch(() => toast.error("Couldn't load your orders"))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setEditForm({ name: customer.name || "", phone: customer.phone || "", address: customer.address || "" });
    setEditing(true);
  };

  const saveEdit = async () => {
    try {
      await updateProfile(editForm);
      toast.success("Details updated");
      setEditing(false);
    } catch {
      toast.error("Couldn't save changes");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">My account</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Hi, {customer.name?.split(" ")[0] || "there"}</h1>
          <p className="mt-2 text-neutral-600">Your orders and delivered licenses, all in one place.</p>
        </div>
        <button onClick={logout} data-testid="account-logout-btn" className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold hover:border-neutral-900">
          <SignOut size={16} weight="bold" /> Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#101826] text-[#FF9776]"><User size={20} weight="duotone" /></div>
              <div className="font-display font-semibold">Your details</div>
            </div>
            {!editing && (
              <button onClick={startEdit} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Edit details">
                <PencilSimple size={16} weight="bold" />
              </button>
            )}
          </div>
          {editing ? (
            <div className="mt-4 space-y-3">
              <div>
                <label className={labelCls}>Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <textarea rows={2} value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className={inputCls} />
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} className="btn-primary flex-1 !px-4 !py-2 text-sm"><Check size={14} weight="bold" /> Save</button>
                <button onClick={() => setEditing(false)} className="btn-outline !px-4 !py-2 text-sm"><X size={14} weight="bold" /> Cancel</button>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-700"><User size={15} weight="duotone" className="text-neutral-400" /> {customer.name}</div>
              <div className="flex items-center gap-2 text-neutral-700"><Envelope size={15} weight="duotone" className="text-neutral-400" /> {customer.email}</div>
              <div className="flex items-center gap-2 text-neutral-700"><Phone size={15} weight="duotone" className="text-neutral-400" /> {customer.phone || "—"}</div>
              <div className="flex items-start gap-2 text-neutral-700"><MapPin size={15} weight="duotone" className="mt-0.5 text-neutral-400" /> {customer.address || "—"}</div>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Package size={20} weight="duotone" />
            <h2 className="font-display text-lg font-semibold">Order history</h2>
          </div>
          {loading ? (
            <div className="mt-4 space-y-3">{[1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-neutral-100" />)}</div>
          ) : orders.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center">
              <div className="font-display font-semibold">No orders yet</div>
              <p className="mt-1 text-sm text-neutral-600">When you buy a license, it'll show up here with its delivery status.</p>
              <Link to="/products" className="btn-primary mt-5 inline-flex">Browse products</Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-sm font-bold">{o.order_number}</div>
                      <div className="mt-0.5 text-xs text-neutral-500">{new Date(o.created_at).toLocaleDateString()} · ${o.total.toFixed(2)}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta[o.status]?.color || "bg-neutral-100"}`}>
                      {statusMeta[o.status]?.label || o.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {o.items.map((it, i) => (
                      <div key={i} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium">{it.product_name} <span className="text-xs text-neutral-500">· {it.variant_label}</span></span>
                          <span className="font-semibold">${it.subtotal.toFixed(2)}</span>
                        </div>
                        {it.license_key ? (
                          <div className="mt-2 rounded-md bg-[#101826] p-2.5 font-mono text-xs tracking-wider text-[#FF9776]">{it.license_key}</div>
                        ) : (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500"><Clock size={13} weight="duotone" /> License pending — check your email shortly.</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
        <ShieldCheck size={20} weight="duotone" className="mt-0.5 shrink-0" />
        <p>Need help with an order or activation? <Link to="/contact" className="font-semibold text-neutral-900 underline">Contact us</Link> or visit the <Link to="/activation" className="font-semibold text-neutral-900 underline">activation portal</Link>.</p>
      </div>
    </div>
  );
}

export default function Account() {
  const { customer, ready } = useCustomer();
  if (!ready) {
    return <div className="container-page py-20"><div className="mx-auto h-64 max-w-md animate-pulse rounded-xl bg-neutral-100" /></div>;
  }
  return (
    <>
      <SEO title="My Account | Garnavo" description="Sign in to your Garnavo account to view orders, delivered licenses and account details." noindex />
      <div className="container-page py-14">
        {customer ? <Dashboard /> : <AuthForm />}
      </div>
    </>
  );
}
