import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

const AuthCtx = createContext(null);
const TOKEN_KEY = "gnv_customer_token";

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setReady(true); return; }
    api.get("/auth/me")
      .then((r) => setCustomer(r.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    localStorage.setItem(TOKEN_KEY, r.data.token);
    setCustomer(r.data.customer);
    return r.data.customer;
  }, []);

  const register = useCallback(async (payload) => {
    const r = await api.post("/auth/register", payload);
    localStorage.setItem(TOKEN_KEY, r.data.token);
    setCustomer(r.data.customer);
    return r.data.customer;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const r = await api.patch("/auth/me", updates);
    setCustomer(r.data);
    return r.data;
  }, []);

  return (
    <AuthCtx.Provider value={{ customer, ready, login, register, logout, updateProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useCustomer = () => useContext(AuthCtx);
export const getCustomerToken = () => localStorage.getItem(TOKEN_KEY);
