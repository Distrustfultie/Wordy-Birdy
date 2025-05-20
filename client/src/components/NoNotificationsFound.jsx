import { BellIcon } from "lucide-react";


/**
 * NoNotificationsFound is a component that displays a message when there are no
 * notifications (friend requests or messages) to display in the notifications
 * page.
 *
 * @returns {React.ReactElement} A JSX element representing the component.
 */
function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-16 rounded-full bg-base-300 flex items-center justify-center">
        <BellIcon className="size-8 text-base-content opacity-40" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
      <p className="text-base-content opacity-70 max-w-md">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
}

export default NoNotificationsFound;