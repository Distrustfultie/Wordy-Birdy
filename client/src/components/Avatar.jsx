import { useState } from "react";

const SIZES = {
  xs: "w-8 text-xs",
  sm: "w-10 text-sm",
  md: "w-12 text-base",
  lg: "w-16 text-lg",
  xl: "w-24 text-2xl",
  "2xl": "w-32 text-4xl",
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

/**
 * Round avatar with an initials fallback when the image is missing or fails.
 * `online`: true shows a green dot, false a grey one, undefined none.
 */
const Avatar = ({ src, name, size = "md", online, ring = false, className = "" }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const presence = online === true ? "online" : online === false ? "offline" : "";

  return (
    <div className={`avatar ${presence} ${showImage ? "" : "placeholder"} ${className}`}>
      <div
        className={`${SIZES[size]} rounded-full ${
          ring ? "ring ring-primary ring-offset-base-100 ring-offset-2" : ""
        } ${
          showImage
            ? "bg-base-300"
            : "bg-gradient-to-br from-primary to-secondary text-primary-content font-semibold"
        }`}
      >
        {showImage ? (
          <img src={src} alt={name || "User avatar"} onError={() => setFailedSrc(src)} />
        ) : (
          <span>{initials(name)}</span>
        )}
      </div>
    </div>
  );
};

export default Avatar;
