import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import useTransitionState from "../../hooks/useTransitionState";

const SIZES = { sm: "sm:max-w-sm", md: "sm:max-w-md", lg: "sm:max-w-lg", xl: "sm:max-w-2xl" };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: rendered in a portal, animated in/out, closes on Escape or
 * backdrop click, traps Tab focus inside, locks page scroll, and returns focus
 * to whatever was focused before it opened. A bottom sheet on phones.
 */
const Modal = ({
  open,
  onClose,
  children,
  size = "md",
  title,
  description,
  initialFocusRef,
  dismissible = true,
  showClose = true,
}) => {
  const { mounted, visible } = useTransitionState(open, 200);
  const panelRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;

  // Latest props without re-running the open/close effect on every render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const dismissibleRef = useRef(dismissible);
  dismissibleRef.current = dismissible;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape" && dismissibleRef.current) {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) return e.preventDefault();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus?.({ preventScroll: true });
    };
  }, [open]);

  // Move focus in once the panel exists (`mounted` lags `open` by a render).
  useEffect(() => {
    if (!open || !mounted) return;
    const target = initialFocusRef?.current || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
    target?.focus({ preventScroll: true });
  }, [open, mounted, initialFocusRef]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => dismissible && onClose?.()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`relative w-full ${SIZES[size]} max-h-[90dvh] overflow-y-auto rounded-t-3xl border border-base-300 bg-base-100 text-base-content shadow-2xl outline-none transition-all duration-200 ease-out sm:rounded-3xl pb-[env(safe-area-inset-bottom)] ${
          visible ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-8 opacity-0 sm:translate-y-2 sm:scale-95"
        }`}
      >
        {/* Grab handle hint for the mobile bottom sheet. */}
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-base-content/15 sm:hidden" aria-hidden="true" />

        {showClose && dismissible && (
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        )}

        <div className="p-6 sm:p-7">
          {title && (
            <h2 id={titleId} className="pr-8 text-lg font-bold tracking-tight">
              {title}
            </h2>
          )}
          {description && <p className="mt-1.5 text-sm text-base-content/70">{description}</p>}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
