import { Bird } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100"
      data-theme={theme}
    >
      <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-4 text-primary-content shadow-lg shadow-primary/30 animate-bounce">
        <Bird className="size-10" />
      </div>
      <span className="loading loading-dots loading-md text-primary" />
    </div>
  );
};

export default PageLoader;
