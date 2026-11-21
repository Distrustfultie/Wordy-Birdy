import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import useTransitionState from "../../hooks/useTransitionState";

/**
 * Custom select (ARIA listbox) replacing the native <select>.
 * options: [{ value, label, icon? }]. Supports keyboard navigation, type-ahead,
 * and an optional search box for long lists.
 */
const Select = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchable = false,
  error = false,
  ariaLabel,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { mounted, visible } = useTransitionState(open, 120);

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const typeahead = useRef({ text: "", timer: null });
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  const openList = () => {
    setQuery("");
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const closeList = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const choose = (option) => {
    onChange(option.value);
    closeList();
  };

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus the search box (or the list) once the panel is actually in the DOM;
  // `mounted` turns true a render after `open`.
  useEffect(() => {
    if (open && mounted) (searchable ? searchRef.current : listRef.current)?.focus({ preventScroll: true });
  }, [open, mounted, searchable]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onButtonKeyDown = (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  const onListKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[activeIndex]) choose(filtered[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        closeList();
        break;
      case "Tab":
        closeList(false);
        break;
      default:
        // Type-ahead: jump to the first option starting with what was typed.
        if (!searchable && e.key.length === 1) {
          const t = typeahead.current;
          clearTimeout(t.timer);
          t.text += e.key.toLowerCase();
          t.timer = setTimeout(() => (t.text = ""), 600);
          const match = filtered.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
          if (match >= 0) setActiveIndex(match);
        }
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onButtonKeyDown}
        className={`input input-bordered flex w-full items-center gap-2.5 text-left transition-shadow ${
          error ? "input-error" : ""
        } ${open ? "border-primary ring-2 ring-primary/20" : ""}`}
      >
        {selected?.icon}
        <span className={`flex-1 truncate ${selected ? "" : "text-base-content/50"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon className={`size-4 shrink-0 opacity-60 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {mounted && (
        <div
          className={`absolute left-0 top-full z-50 mt-2 w-full min-w-[13rem] origin-top rounded-2xl border border-base-300 bg-base-100 p-1.5 shadow-xl transition duration-150 ease-out ${
            visible ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          {searchable && (
            <label className="input input-sm input-bordered mb-1.5 flex items-center gap-2">
              <SearchIcon className="size-3.5 opacity-60" />
              <input
                ref={searchRef}
                className="grow"
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onListKeyDown}
                aria-label="Search options"
              />
            </label>
          )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined}
            onKeyDown={onListKeyDown}
            className="max-h-64 overflow-y-auto outline-none"
          >
            {filtered.map((option, i) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(i)}
                  // Keep focus in the list so the click isn't treated as an outside click.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(option)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                    i === activeIndex ? "bg-base-content/10" : ""
                  } ${isSelected ? "font-semibold text-primary" : ""}`}
                >
                  {option.icon}
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected && <CheckIcon className="size-4 shrink-0" />}
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-base-content/50">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
