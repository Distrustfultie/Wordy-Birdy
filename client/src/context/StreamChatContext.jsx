import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";
import useStreamToken from "../hooks/useStreamToken";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const StreamChatContext = createContext({ client: null, unreadCount: 0, error: null });

/**
 * Keeps one Stream Chat connection open for the whole logged-in session, so the
 * inbox, chat page, online indicators and unread badges all share it.
 * Disconnects automatically on logout or when the user changes.
 */
export function StreamChatProvider({ children }) {
  const { authUser } = useAuthUser();
  const { token } = useStreamToken();

  const [client, setClient] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  const userId = authUser?.isOnboarded ? authUser._id : null;
  const name = authUser?.fullName;
  const image = authUser?.profilePic;

  useEffect(() => {
    if (!userId || !token) return;

    // A fresh instance per connection (not the singleton) so cleanup can't race a reconnect.
    const chat = new StreamChat(STREAM_API_KEY);
    let cancelled = false;

    const subscription = chat.on((event) => {
      if (!cancelled && typeof event.total_unread_count === "number") {
        setUnreadCount(event.total_unread_count);
      }
    });

    const connecting = chat
      .connectUser({ id: userId, name, image }, token)
      .then((res) => {
        if (cancelled) return;
        setUnreadCount(res?.me?.total_unread_count ?? 0);
        setError(null);
        setClient(chat);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error connecting to Stream chat:", err);
        setError(err);
      });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      setClient(null);
      setUnreadCount(0);
      connecting.finally(() => chat.disconnectUser());
    };
  }, [userId, name, image, token]);

  return (
    <StreamChatContext.Provider value={{ client, unreadCount, error }}>
      {children}
    </StreamChatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStreamChat = () => useContext(StreamChatContext);
