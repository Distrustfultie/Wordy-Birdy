import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

/**
 * The Layout component is a wrapper for the main content of the page. It
 * contains a sidebar and a navbar, and the main content is rendered as
 * children of the Layout component.
 *
 * The `showSidebar` prop is an optional boolean that determines whether the
 * sidebar should be shown. If it is not provided, the sidebar will not be shown.
 *
 * @param {{ children: React.ReactNode, showSidebar?: boolean }} props
 * @returns {React.ReactElement}
 */
const Layout = ({ children, showSidebar = false }) => {
    return <div className="min-h-screen" >
        <div className="flex" >
            {showSidebar && <Sidebar />}
            <div className="flex-1 flex flex-col" >
                <Navbar />

                <main className="flex-1 overflow-y-auto" >
                    {children}
                </main>
            </div>
        </div>
    </div>

}

export default Layout