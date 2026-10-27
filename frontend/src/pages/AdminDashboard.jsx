import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { SignOut, Package, Envelope, CurrencyDollar, ShieldCheck, Clock, CheckCircle, ArrowLeft, User, Users } from "@phosphor-icons/react";
import ProductManager from "@/components/admin/ProductManager";

const STATUS_COLORS = {
  pending: "bg-neutral-100 text-neutral-700",
  paid: "bg-yellow-100 text-yellow-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

const ALL_STATUSES = ["pending", "paid", "delivered", "cancelled", "refunded"];

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] || "bg-neutral-100"}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState("orders");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("bik_admin_token") : null;
  const adminEmail = typeof window !== "undefined" ? localStorage.getItem("bik_admin_email") : null;

  const load = useCallback(async () => {
    try {
      const [s, o, p, c] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/orders", { params: filter ? { status: filter } : {} }),
        api.get("/admin/products"),
        api.get("/admin/customers"),
      ]);
      setStats(s.data); setOrders(o.data); setProducts(p.data); setCustomers(c.data);
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem("bik_admin_token");
        nav("/admin/login");
      }
    }
  }, [filter, nav]);

  useEffect(() => {
    if (!token) { nav("/admin/login"); return; }
    load();
  }, [token, load, nav]);

  const logout = () => {
    localStorage.removeItem("bik_admin_token");
    localStorage.removeItem("bik_admin_email");
    nav("/admin/login");
  };

  const StatCard = ({ icon, label, value, testId }) => (
    <div data-testid={testId} className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#101826] text-[#FF9776]">{icon}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );

  if (selectedOrderId) {
    return (
      <div className="container-page py-10">
        <OrderDetail
          orderId={selectedOrderId}
          onBack={() => { setSelectedOrderId(null); load(); }}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Admin</div>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Store dashboard</h1>
          <div className="mt-1 text-sm text-neutral-500">Signed in as {adminEmail}</div>
        </div>
        <button onClick={logout} data-testid="admin-logout-btn" className="btn-outline"><SignOut size={18} weight="duotone" /> Sign out</button>
      </div>

      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={<CurrencyDollar size={18} weight="duotone" />} label="Revenue" value={`$${stats.revenue.toFixed(2)}`} testId="stat-revenue" />
          <StatCard icon={<Package size={18} weight="duotone" />} label="Orders" value={stats.total_orders} testId="stat-total-orders" />
          <StatCard icon={<Clock size={18} weight="duotone" />} label="Awaiting delivery" value={stats.paid} testId="stat-paid" />
          <StatCard icon={<CheckCircle size={18} weight="duotone" />} label="Delivered" value={stats.delivered} testId="stat-delivered" />
          <StatCard icon={<ShieldCheck size={18} weight="duotone" />} label="Products" value={stats.products} testId="stat-products" />
        </div>
      )}

      <div className="mt-10 flex gap-1 border-b border-neutral-200">
        {[
          { k: "orders", label: "Orders" },
          { k: "customers", label: "Customers" },
          { k: "products", label: "Products" },
        ].map((t) => (
          <button
            key={t.k}
            data-testid={`admin-tab-${t.k}`}
            onClick={() => setTab(t.k)}
            className={`px-4 py-2 text-sm font-semibold ${tab === t.k ? "border-b-2 border-neutral-900 text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {["", "pending", "paid", "delivered", "cancelled"].map((s) => (
              <button
                key={s || "all"}
                data-testid={`admin-filter-${s || "all"}`}
                onClick={() => setFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${filter === s ? "border-neutral-900 bg-[#101826] text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900"}`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="hidden px-4 py-3 md:table-cell">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    data-testid={`admin-order-${o.order_number}`}
                    onClick={() => setSelectedOrderId(o.id)}
                    className="cursor-pointer border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 font-mono font-semibold">{o.order_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.customer_name}</div>
                      <div className="text-xs text-neutral-500">{o.customer_email}</div>
                    </td>
                    <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">{new Date(o.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right font-semibold">${o.total.toFixed(2)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-neutral-500">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "customers" && (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3">Customer</th>
                <th className="hidden px-4 py-3 md:table-cell">Phone</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3 text-right">Total spent</th>
                <th className="hidden px-4 py-3 md:table-cell">Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email} data-testid={`admin-customer-${c.email}`} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100 text-neutral-500"><User size={16} weight="duotone" /></div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-neutral-500">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{c.phone ? <a className="text-[#FF6B45] underline" href={`tel:${c.phone}`}>{c.phone}</a> : "—"}</td>
                  <td className="px-4 py-3">{c.orders_count}</td>
                  <td className="px-4 py-3 text-right font-semibold">${c.total_spent.toFixed(2)}</td>
                  <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">{new Date(c.last_order_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-neutral-500">No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <ProductManager products={products} onChange={load} />
      )}
    </div>
  );
}

function OrderDetail({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [keys, setKeys] = useState([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api.get(`/admin/orders/${orderId}`);
      setOrder(r.data);
      setKeys(r.data.items.map((it) => it.license_key || ""));
      setNote(r.data.admin_notes || "");
      setStatus(r.data.status);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to load order");
      onBack();
    }
  }, [orderId, onBack]);

  useEffect(() => { load(); }, [load]);

  const deliver = async () => {
    if (keys.some((k) => !k.trim())) {
      toast.error("Please enter a license key for every item.");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/admin/orders/${order.id}/deliver`, {
        keys: keys.map((k) => ({ license_key: k.trim() })),
        admin_note: note.trim() || null,
      });
      toast.success("Keys delivered — order marked delivered, email sent");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to deliver");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async () => {
    setSavingStatus(true);
    try {
      await api.patch(`/admin/orders/${order.id}`, { status, admin_notes: note.trim() || null });
      toast.success(`Order marked ${status}`);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  };

  if (!order) return <div className="py-20 text-center text-neutral-500">Loading order…</div>;

  const address = [order.customer_address].filter(Boolean).join(", ");

  return (
    <div>
      <button onClick={onBack} data-testid="order-back-btn" className="btn-outline"><ArrowLeft size={16} weight="duotone" /> Back to orders</button>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-xl font-bold sm:text-2xl">{order.order_number}</h1>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-1 text-sm text-neutral-500">Placed {new Date(order.created_at).toLocaleString()}{order.paid_at ? ` · Paid ${new Date(order.paid_at).toLocaleString()}` : ""}</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            data-testid="order-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40"
          >
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={updateStatus} disabled={savingStatus} data-testid="order-status-update-btn" className="btn-primary">
            {savingStatus ? "Saving..." : "Update status"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Order items</div>
            <div className="divide-y divide-neutral-100">
              {order.items.map((it, i) => (
                <div key={i} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{it.product_name}</div>
                      <div className="text-sm text-neutral-500">{it.variant_label} × {it.quantity}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">${it.subtotal.toFixed(2)}</div>
                      <div className="text-neutral-500">${it.unit_price.toFixed(2)} each</div>
                    </div>
                  </div>
                  {(order.status === "paid" || order.status === "delivered") && (
                    <div className="mt-3">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">License key</label>
                      <input
                        data-testid={`order-key-input-${i}`}
                        value={keys[i]}
                        onChange={(e) => setKeys(keys.map((k, idx) => idx === i ? e.target.value : k))}
                        placeholder="Paste license key here"
                        disabled={order.status === "delivered"}
                        className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40 disabled:bg-neutral-100"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 px-5 py-4 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              {order.discount_amount > 0 && (
                <div className="mt-1 flex justify-between"><span className="text-neutral-500">Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span><span>-${order.discount_amount.toFixed(2)}</span></div>
              )}
              <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 font-bold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
            </div>
          </div>

          {order.status === "paid" && (
            <div className="rounded-xl border border-[#FF6B45]/30 bg-[#FFF1EC] p-5">
              <div className="flex items-center gap-2 font-semibold"><Envelope size={18} weight="duotone" /> Deliver license keys</div>
              <p className="mt-1 text-sm text-neutral-600">Sending keys emails the customer and marks this order as delivered automatically.</p>
              <button onClick={deliver} disabled={saving} data-testid="order-deliver-btn" className="btn-primary mt-3">
                {saving ? "Sending..." : "Send keys via email"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"><Users size={16} weight="duotone" /> Customer</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="font-semibold">{order.customer_name}</div>
              <div><span className="text-neutral-500">Email:</span> <a className="text-[#FF6B45] underline" href={`mailto:${order.customer_email}`}>{order.customer_email}</a></div>
              <div><span className="text-neutral-500">Phone:</span> {order.customer_phone ? <a className="text-[#FF6B45] underline" href={`tel:${order.customer_phone}`}>{order.customer_phone}</a> : "—"}</div>
              <div><span className="text-neutral-500">Address:</span> {address || "—"}</div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Payment</div>
            <div className="mt-3 space-y-2 text-sm">
              <div><span className="text-neutral-500">Method:</span> {order.payment_method || "—"}</div>
              {order.paypal_order_id && <div><span className="text-neutral-500">PayPal ID:</span> <span className="font-mono text-xs">{order.paypal_order_id}</span></div>}
              <div><span className="text-neutral-500">Paid at:</span> {order.paid_at ? new Date(order.paid_at).toLocaleString() : "—"}</div>
              <div><span className="text-neutral-500">Delivered at:</span> {order.delivered_at ? new Date(order.delivered_at).toLocaleString() : "—"}</div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Order notes</div>
            <textarea
              data-testid="order-notes-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Internal note (optional)"
              rows={3}
              className="mt-3 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[#FF6B45] focus:ring-2 focus:ring-[#FF6B45]/40"
            />
            <button onClick={updateStatus} disabled={savingStatus} className="btn-outline mt-2">Save notes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
