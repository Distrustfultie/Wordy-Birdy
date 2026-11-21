import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

/** Password field with a show/hide toggle. */
const PasswordInput = ({ value, onChange, placeholder = "••••••••", autoComplete, minLength }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className="input input-bordered w-full pr-12"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        required
      />
      {/* Flex-centred wrapper: DaisyUI's .btn sets its own transform, which breaks translate-based centring. */}
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
