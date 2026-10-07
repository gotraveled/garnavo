import axios from "axios";

// The frontend is a static site on Render (buyinstantkeys-frontend.onrender.com)
// and the FastAPI backend is a separate Render service. Default to the deployed
// backend so the built app reaches it with no env config. Override with
// REACT_APP_BACKEND_URL if the backend URL ever changes.
const DEFAULT_BACKEND = "https://buyinstantkeys-backend.onrender.com";
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || DEFAULT_BACKEND).replace(/\/$/, "");
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Helps diagnose "products not loading": check the console for the resolved base.
if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.info(`[Garnavo] API base: ${API || "/api (same-origin)"}`);
}

// ---- localStorage product cache (stale-while-revalidate) ----
const CACHE_PREFIX = "gnv_api_";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes fresh
const CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes max (show stale while revalidating)

function _cacheKey(url, params) {
  const p = params ? JSON.stringify(params, Object.keys(params).sort()) : "";
  return CACHE_PREFIX + url + p;
}

function _cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_MAX_AGE) { localStorage.removeItem(key); return null; }
    return { data, fresh: Date.now() - ts < CACHE_TTL };
  } catch { return null; }
}

function _cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

/**
 * Cached GET for product endpoints. Returns cached data instantly,
 * revalidates in background, and calls onUpdate when fresh data arrives.
 * Usage: cachedGet("/products", { params }, setProducts)
 */
export function cachedGet(url, config = {}, onUpdate) {
  const key = _cacheKey(url, config.params);
  const cached = _cacheGet(key);

  const networkPromise = api.get(url, config).then((r) => {
    _cacheSet(key, r.data);
    if (onUpdate) onUpdate(r.data);
    return r;
  });

  if (cached) {
    // Return cached data immediately, network updates in background
    return { data: cached.data, fresh: cached.fresh, networkPromise };
  }
  return null; // no cache, caller should await networkPromise
}

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("bik_admin_token");
  if (adminToken && config.url && config.url.startsWith("/admin")) {
    config.headers.Authorization = `Bearer ${adminToken}`;
    return config;
  }
  const customerToken = localStorage.getItem("gnv_customer_token");
  if (customerToken && config.url && config.url.startsWith("/auth")) {
    config.headers.Authorization = `Bearer ${customerToken}`;
  }
  return config;
});
