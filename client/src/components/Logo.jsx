import { Bird } from "lucide-react";
import { Link } from "react-router-dom";

/** Brand mark + wordmark. `size` is "sm" | "md" | "lg". */
const Logo = ({ size = "md", to = "/", className = "" }) => {
  const sizes = {
    sm: { icon: "size-5", text: "text-xl", box: "p-1.5" },
    md: { icon: "size-6", text: "text-2xl", box: "p-2" },
    lg: { icon: "size-8", text: "text-3xl", box: "p-2.5" },
  }[size];

  return (
    <Link to={to} className={`flex items-center gap-2.5 group ${className}`}>
      <span
        className={`${sizes.box} rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/30 transition-transform group-hover:-rotate-6`}
      >
        <Bird className={sizes.icon} />
      </span>
      <span
        className={`${sizes.text} font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}
      >
        WordyBirdy
      </span>
    </Link>
  );
};

export default Logo;
