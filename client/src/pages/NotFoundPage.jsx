import { Link } from "react-router-dom";
import { Bird } from "lucide-react";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100 p-6 text-center">
    <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-5 text-primary-content shadow-lg">
      <Bird className="size-12 -rotate-12" />
    </div>
    <h1 className="text-5xl font-extrabold">404</h1>
    <p className="max-w-sm text-base-content/70">This bird flew off. The page you&apos;re looking for doesn&apos;t exist.</p>
    <Link to="/" className="btn btn-primary">Take me home</Link>
  </div>
);

export default NotFoundPage;
