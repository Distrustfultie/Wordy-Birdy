import { VideoIcon} from 'lucide-react'
import React from 'react'

/**
 * Renders a button that will initiate a video call when clicked.
 *
 * @param {Function} handleVideoCall - A function that will be called when the
 * button is clicked.
 *
 * @returns {React.ReactElement} A JSX element representing the call button.
 */
const CallButton = ({handleVideoCall}) => {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0" >
        <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white" >
            <VideoIcon className="size-6" />
        </button>
    </div>
  )
}

export default CallButton;