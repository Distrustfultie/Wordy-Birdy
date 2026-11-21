import { GlobeIcon, MessageCircleIcon, VideoIcon } from "lucide-react";
import Logo from "./Logo";
import { LanguageFlag } from "./LanguageBadge";

const PERKS = [
  { icon: GlobeIcon, text: "Get matched with native speakers of the language you're learning" },
  { icon: MessageCircleIcon, text: "Chat in real time, with threads and reactions" },
  { icon: VideoIcon, text: "Jump on a video call when you're ready to speak" },
];

/** Decorative conversation shown on the auth pages' brand panel. */
export const ChatIllustration = ({ className = "max-w-sm" }) => (
  <div className={`relative mx-auto w-full ${className}`}>
    <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl" />
    <div className="relative space-y-3 rounded-3xl border border-base-content/10 bg-base-100/90 p-5 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-2 border-b border-base-300 pb-3">
        <span className="size-2.5 rounded-full bg-success" />
        <span className="text-sm font-semibold">Lucía</span>
        <LanguageFlag language="spanish" />
        <span className="ml-auto badge badge-ghost badge-sm gap-1">
          <VideoIcon className="size-3" /> Call
        </span>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-secondary text-sm">¡Hola! ¿Cómo estuvo tu día?</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-primary text-sm">¡Muy bien! Practiqué mucho español 🎉</div>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-secondary text-sm">Your Spanish is getting so good!</div>
      </div>
    </div>
  </div>
);

/** Split-screen shell for login/signup: form on the left, brand panel on the right. */
const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-base-100 grid lg:grid-cols-2">
    <div className="flex flex-col px-5 py-8 sm:px-10">
      <Logo />
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-base-content/70">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>

    <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-base-200 to-secondary/15 p-12">
      <ChatIllustration />
      <div className="mt-12 max-w-sm space-y-4">
        {PERKS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3">
            <span className="rounded-xl bg-primary/15 p-2 text-primary">
              <Icon className="size-5" />
            </span>
            <p className="text-sm text-base-content/80 pt-1">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AuthLayout;
