import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BellIcon,
  GlobeIcon,
  MessageCircleIcon,
  PaletteIcon,
  SparklesIcon,
  UserPlusIcon,
  VideoIcon,
} from "lucide-react";
import Logo from "../components/Logo";
import ThemeSelector from "../components/ThemeSelector";
import { ChatIllustration } from "../components/AuthLayout";
import { LanguageFlag } from "../components/LanguageBadge";
import { LANGUAGES } from "../constants";

const FEATURES = [
  {
    icon: SparklesIcon,
    title: "Smart matching",
    text: "We put native speakers of the language you're learning at the top of your list.",
  },
  {
    icon: MessageCircleIcon,
    title: "Real-time chat",
    text: "Message friends instantly, with threads, reactions and read receipts.",
  },
  {
    icon: VideoIcon,
    title: "Video calls",
    text: "Practice speaking face to face with one tap, right from the conversation.",
  },
  {
    icon: BellIcon,
    title: "Stay in the loop",
    text: "Live badges for new messages and friend requests, wherever you are in the app.",
  },
  {
    icon: GlobeIcon,
    title: "A global community",
    text: `Learners of ${LANGUAGES.length}+ languages from all over the world.`,
  },
  {
    icon: PaletteIcon,
    title: "Make it yours",
    text: "Over 30 themes, from calm pastels to neon cyberpunk.",
  },
];

const STEPS = [
  { title: "Create your profile", text: "Tell us your native language and the one you're learning." },
  { title: "Find your match", text: "Browse partners, filter by language, and send a friend request." },
  { title: "Start talking", text: "Chat, swap corrections, and hop on a call when you're ready." },
];

const LandingPage = () => (
  <div className="min-h-screen bg-base-100">
    {/* Nav */}
    <header className="sticky top-0 z-30 border-b border-base-300/60 bg-base-100/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-2 px-4 sm:gap-4 sm:px-8 lg:px-12">
        <Logo size="sm" />
        <nav className="ml-6 hidden md:flex items-center gap-6 text-sm text-base-content/70">
          <a href="#features" className="hover:text-base-content">Features</a>
          <a href="#how" className="hover:text-base-content">How it works</a>
          <a href="#languages" className="hover:text-base-content">Languages</a>
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <ThemeSelector />
          </div>
          <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[32rem] rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-screen-2xl items-center gap-14 px-4 py-16 sm:px-8 lg:px-12 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="badge badge-primary badge-outline gap-1.5 py-3">
            <SparklesIcon className="size-3.5" /> Learn by talking, not by memorizing
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Practice any language with{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              a native speaker
            </span>{" "}
            friend.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-base-content/70">
            WordyBirdy pairs you with people who speak the language you&apos;re learning and want to
            learn yours. Chat, call, and get fluent together.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start for free <ArrowRightIcon className="size-5" />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">I have an account</Link>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-1">
              {LANGUAGES.slice(0, 6).map((lang) => (
                <span key={lang} className="rounded-full bg-base-100 p-1 ring-2 ring-base-100">
                  <LanguageFlag language={lang} className="h-4" />
                </span>
              ))}
            </div>
            <p className="text-sm text-base-content/60">{LANGUAGES.length} languages and counting</p>
          </div>
        </div>
        <ChatIllustration className="max-w-sm lg:max-w-md xl:max-w-lg" />
      </div>
    </section>

    {/* Features */}
    <section id="features" className="bg-base-200/60 py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to get talking</h2>
          <p className="mt-3 text-base-content/70">
            No textbooks, no drills. Real conversations with real people.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-base-300 bg-base-100 p-6 transition-shadow hover:shadow-lg">
              <span className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-base-content/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how" className="py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ title, text }, i) => (
            <div key={title} className="relative rounded-3xl bg-base-200 p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-primary-content">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-base-content/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Languages */}
    <section id="languages" className="bg-base-200/60 py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pick your language</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {LANGUAGES.map((lang) => (
            <span key={lang} className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-sm font-medium">
              <LanguageFlag language={lang} className="h-3.5" /> {lang}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] bg-gradient-to-br from-primary to-secondary p-10 text-center text-primary-content shadow-xl sm:p-14">
          <h2 className="text-3xl font-bold sm:text-4xl">Your next language friend is waiting</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Join free, set up your profile in under a minute, and say hello.
          </p>
          <Link to="/signup" className="btn btn-lg mt-8 border-none bg-base-100 text-base-content hover:bg-base-200">
            <UserPlusIcon className="size-5" /> Create your account
          </Link>
        </div>
      </div>
    </section>

    <footer className="border-t border-base-300 py-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8 lg:px-12">
        <Logo size="sm" />
        <p className="text-sm text-base-content/60">
          © {new Date().getFullYear()} WordyBirdy. Made for language lovers.
        </p>
      </div>
    </footer>
  </div>
);

export default LandingPage;
