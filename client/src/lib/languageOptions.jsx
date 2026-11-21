import { LANGUAGES } from "../constants";
import { LanguageFlag } from "../components/LanguageBadge";

/**
 * Options for <Select> with a flag per language. Values are lowercase, matching
 * what's stored on user profiles.
 * @param {(lang: string) => string} [label] custom label, e.g. (l) => `Speaks ${l}`
 */
export const languageOptions = (label = (lang) => lang) =>
  LANGUAGES.map((lang) => ({
    value: lang.toLowerCase(),
    label: label(lang),
    icon: <LanguageFlag language={lang} className="h-3.5" />,
  }));
