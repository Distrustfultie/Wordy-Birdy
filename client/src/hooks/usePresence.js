import { useEffect, useState } from "react";
import { useStreamChat } from "../context/StreamChatContext";

/**
 * Live online status for a set of user ids, via Stream presence.
 * @param {string[]} userIds
 * @returns {Set<string>} ids of users currently online
 */
const usePresence = (userIds = []) => {
  const { client } = useStreamChat();
  const [online, setOnline] = useState(() => new Set());

  // Stable key so a new array with the same ids doesn't re-subscribe.
  const key = [...new Set(userIds.filter(Boolean))].sort().join(",");

  useEffect(() => {
    if (!client || !key) return;
    let active = true;
    const ids = key.split(",");

    client
      .queryUsers({ id: { $in: ids } }, {}, { presence: true, limit: ids.length })
      .then(({ users }) => {
        if (active) setOnline(new Set(users.filter((u) => u.online).map((u) => u.id)));
      })
      .catch((err) => console.error("Error loading presence:", err));

    const sub = client.on("user.presence.changed", (event) => {
      if (!event.user || !ids.includes(event.user.id)) return;
      setOnline((prev) => {
        const next = new Set(prev);
        if (event.user.online) next.add(event.user.id);
        else next.delete(event.user.id);
        return next;
      });
    });

    return () => {
      active = false;
      sub.unsubscribe();
    };
  }, [client, key]);

  return online;
};

export default usePresence;
