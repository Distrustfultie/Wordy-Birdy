import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertTriangleIcon, HelpCircleIcon } from "lucide-react";
import Modal from "../components/ui/Modal";

const ConfirmContext = createContext(null);

/**
 * App-wide confirmation dialog.
 *
 *   const confirm = useConfirm();
 *   if (await confirm({ title: "Log out?", confirmLabel: "Log out", tone: "danger" })) logout();
 *
 * Options: title, message, confirmLabel, cancelLabel, tone ("danger" | "primary"), icon.
 * Resolves true when confirmed, false when cancelled or dismissed.
 */
export function ConfirmProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({});
  const resolver = useRef(null);
  const cancelRef = useRef(null);

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        resolver.current?.(false); // a previous dialog that never answered
        resolver.current = resolve;
        setOptions(opts);
        setOpen(true);
      }),
    []
  );

  const settle = (result) => {
    resolver.current?.(result);
    resolver.current = null;
    setOpen(false);
  };

  const danger = options.tone !== "primary";
  const Icon = options.icon || (danger ? AlertTriangleIcon : HelpCircleIcon);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {/* Safer default for destructive actions: focus starts on Cancel. */}
      <Modal open={open} onClose={() => settle(false)} size="sm" initialFocusRef={cancelRef} showClose={false}>
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className={`mb-4 rounded-2xl p-3 ${danger ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}>
            <Icon className="size-6" />
          </span>
          <h2 className="text-lg font-bold tracking-tight">{options.title}</h2>
          {options.message && <p className="mt-2 text-sm leading-relaxed text-base-content/70">{options.message}</p>}
        </div>
        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" className="btn btn-ghost" onClick={() => settle(false)}>
            {options.cancelLabel || "Cancel"}
          </button>
          <button
            type="button"
            className={`btn ${danger ? "btn-error" : "btn-primary"}`}
            onClick={() => settle(true)}
          >
            {options.confirmLabel || "Confirm"}
          </button>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useConfirm = () => {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return confirm;
};
