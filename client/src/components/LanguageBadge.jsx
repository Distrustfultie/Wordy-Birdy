import { LANGUAGE_TO_FLAG } from "../constants";
import { capitalize } from "../lib/utilis";

/** Small flag image for a language name, or null if unknown. */
export function LanguageFlag({ language, className = "h-3" }) {
  const code = language ? LANGUAGE_TO_FLAG[language.toLowerCase()] : null;
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/24x18/${code}.png`}
      alt=""
      aria-hidden="true"
      className={`${className} inline-block rounded-[2px]`}
    />
  );
}

/** Badge such as "[flag] Native: Spanish". `kind` is "native" | "learning". */
const LanguageBadge = ({ language, kind = "native" }) => {
  if (!language) return null;
  const native = kind === "native";
  return (
    <span
      className={`badge badge-sm gap-1.5 py-2.5 ${
        native ? "badge-secondary" : "badge-outline border-base-content/20"
      }`}
    >
      <LanguageFlag language={language} />
      <span className="opacity-80">{native ? "Native" : "Learning"}:</span>
      <span className="font-medium">{capitalize(language)}</span>
    </span>
  );
};

export default LanguageBadge;
