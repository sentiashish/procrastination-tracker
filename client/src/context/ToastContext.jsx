import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const TOAST_TIMEOUT_MS = 3200;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((payload) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type: payload?.type || "info",
      title: payload?.title || "Update",
      message: payload?.message || "Action completed",
    };

    setToasts((prev) => [toast, ...prev].slice(0, 4));

    window.setTimeout(() => {
      removeToast(id);
    }, TOAST_TIMEOUT_MS);
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-xl backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                : toast.type === "error"
                ? "border-rose-400/40 bg-rose-500/15 text-rose-100"
                : "border-slate-500/40 bg-slate-800/95 text-slate-100"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-1 text-xs opacity-90">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="rounded px-2 py-1 text-xs hover:bg-black/20"
                aria-label="Dismiss notification"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
