import { LoaderPinwheel } from 'lucide-react'
import React from 'react'

/**
 * ChatLoader is a component that displays a full-screen loading indicator
 * with a spinning LoaderPinwheel icon and a message indicating that the
 * chat is connecting. It is centered both vertically and horizontally.
 *
 * @returns {JSX.Element} The ChatLoader component.
 */

const ChatLoader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4" >
        <LoaderPinwheel className="animate-spin size-10 text-primary" />
        <p className="mt-4 text-center text-lg font-mono" >
            Connecting to chat...
        </p>
    </div>
  )
}

export default ChatLoader