import { MessageCircleIcon } from "lucide-react";

const ChatLoader = ({ label = "Connecting to chat..." }) => (
  <div className="h-full min-h-[60vh] flex flex-col items-center justify-center gap-3 p-4">
    <div className="rounded-2xl bg-primary/10 p-4 text-primary">
      <MessageCircleIcon className="size-8 animate-pulse" />
    </div>
    <p className="text-sm text-base-content/70">{label}</p>
    <span className="loading loading-dots loading-sm text-primary" />
  </div>
);

export default ChatLoader;
