import { LoaderPinwheel } from 'lucide-react';
import React from 'react'
import { useThemeStore } from '../store/useThemeStore';

/**
 * PageLoader is a full-screen component that displays a spinning
 * LoaderPinwheel icon, filling the available space. It uses the
 * current theme from the useThemeStore hook to set the theme on the
 * container element.
 *
 * @returns {JSX.Element} The PageLoader component.
 */
const PageLoader = () => {
  const { theme } =useThemeStore();
  return (
    <div
      className=" min-h-screen flex items-center justify-center "
      data-theme={theme}
    >
      <LoaderPinwheel className="animate-spin size-10 text-primary" />
    </div>
  );
}

export default PageLoader