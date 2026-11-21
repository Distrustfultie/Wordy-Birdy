import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useTransitionState from "../../hooks/useTransitionState";

const DropdownContext = createContext({ close: () => {} });

/**
 * Menu button with an animated panel. Closes on outside click, Escape, or
 * choosing an item; arrow keys / Home / End move between items.
 *
 * `trigger` is the button's content; `triggerClassName` styles the button.
 */
export const Dropdown = ({
  trigger,
  triggerClassName = "btn btn-ghost btn-circle",
  label,
  align = "end",
  width = "w-56",
  panelClassName = "",
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState(align);
  const { mounted, visible } = useTransitionState(open, 120);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Flip to the other side if the preferred alignment would run off-screen.
  // Measured before paint, so the panel never flashes in the wrong place.
  useLayoutEffect(() => {
    if (!mounted || !buttonRef.current || !menuRef.current) return;
    const button = buttonRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current.offsetWidth;
    const margin = 8;
    const fitsEnd = button.right - menuWidth >= margin;
    const fitsStart = button.left + menuWidth <= window.innerWidth - margin;
    setSide(align === "end" ? (fitsEnd || !fitsStart ? "end" : "start") : fitsStart || !fitsEnd ? "start" : "end");
  }, [mounted, align]);

  useEffect(() => {
    if (!open) return;

    const items = () => [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])];

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e) => {
      const list = items();
      const index = list.indexOf(document.activeElement);
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        list[(index + 1) % list.length]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        list[(index - 1 + list.length) % list.length]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        list[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        list[list.length - 1]?.focus();
      } else if (e.key === "Tab") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Once the panel is in the DOM (`mounted` lags `open` by a render), focus the
  // active item or the first, so keyboard users land inside the menu.
  useEffect(() => {
    if (!open || !mounted) return;
    const list = [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])];
    (list.find((el) => el.dataset.active === "true") || list[0])?.focus({ preventScroll: true });
  }, [open, mounted]);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        className={triggerClassName}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>

      {mounted && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          className={`absolute top-full z-50 mt-2 ${
            side === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          } ${width} max-w-[calc(100vw-1rem)] rounded-2xl border border-base-300 bg-base-100 p-1.5 text-base-content shadow-xl transition duration-150 ease-out ${
            visible ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          } ${panelClassName}`}
        >
          <DropdownContext.Provider value={{ close }}>{children}</DropdownContext.Provider>
        </div>
      )}
    </div>
  );
};

/** A menu entry: a button, or a link when `to` is given. */
export const DropdownItem = ({ icon: Icon, children, onClick, to, danger = false, active = false, trailing }) => {
  const { close } = useContext(DropdownContext);

  const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm outline-none transition-colors ${
    danger
      ? "text-error hover:bg-error/10 focus-visible:bg-error/10"
      : active
        ? "bg-primary/10 font-semibold text-primary"
        : "hover:bg-base-content/10 focus-visible:bg-base-content/10"
  }`;

  const handleClick = (e) => {
    onClick?.(e);
    close();
  };

  const content = (
    <>
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing}
    </>
  );

  return to ? (
    <Link role="menuitem" to={to} className={className} onClick={handleClick} data-active={active}>
      {content}
    </Link>
  ) : (
    <button type="button" role="menuitem" className={className} onClick={handleClick} data-active={active}>
      {content}
    </button>
  );
};

export const DropdownLabel = ({ children }) => (
  <div className="px-3 pb-2 pt-1.5 text-xs font-semibold uppercase tracking-wide text-base-content/50">{children}</div>
);

export const DropdownDivider = () => <div className="my-1.5 h-px bg-base-300" role="separator" />;
