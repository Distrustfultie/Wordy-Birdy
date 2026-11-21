export const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

/** The server's error message from an axios error, or a fallback. */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.message || fallback;

/** "just now", "5m ago", "3h ago", "2d ago", or a date for anything older. */
export function timeAgo(date) {
  if (!date) return "";
  const then = new Date(date);
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** "Joined March 2025" style label. */
export const memberSince = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "";

/** Morning/afternoon/evening greeting for the current local time. */
export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Deterministic 1:1 channel id shared by both users. */
export const directChannelId = (a, b) => [a, b].sort().join("-");

export const randomAvatar = () =>
  `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png`;
