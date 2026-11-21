import { CheckIcon, PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { Dropdown, DropdownItem, DropdownLabel } from "./ui/Dropdown";

/** Preview swatches for a theme. */
export const ThemeSwatches = ({ colors }) => (
  <span className="flex gap-1">
    {colors.map((color, i) => (
      <span
        key={i}
        className="size-2.5 rounded-full ring-1 ring-base-content/10"
        style={{ backgroundColor: color }}
      />
    ))}
  </span>
);

/** Compact theme picker for the top bar. */
const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <Dropdown trigger={<PaletteIcon className="size-5" />} label="Change theme" width="w-64" panelClassName="max-h-96 overflow-y-auto">
      <DropdownLabel>Theme</DropdownLabel>
      {THEMES.map((option) => {
        const active = theme === option.name;
        return (
          <DropdownItem
            key={option.name}
            active={active}
            onClick={() => setTheme(option.name)}
            trailing={
              <span className="flex items-center gap-2">
                <ThemeSwatches colors={option.colors} />
                <CheckIcon className={`size-4 ${active ? "opacity-100" : "opacity-0"}`} />
              </span>
            }
          >
            {option.label}
          </DropdownItem>
        );
      })}
    </Dropdown>
  );
};

export default ThemeSelector;
