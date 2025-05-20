import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamify-theme") || "cupcake",
  /**
   * Sets the theme for the application. The theme is stored in local storage
   * and updated in the store. The theme can be one of the following:
   *
   * - "light"
   * - "dark"
   * - "cupcake"
   * - "bumblebee"
   * - "emerald"
   * - "corporate"
   * - "synthwave"
   * - "retro"
   * - "cyberpunk"
   * - "valentine"
   * - "halloween"
   * - "garden"
   * - "forest"
   * - "aqua"
   * - "lofi"
   * - "pastel"
   * - "fantasy"
   * - "wireframe"
   * - "black"
   * - "luxury"
   * - "dracula"
   * - "cmyk"
   * - "autumn"
   * - "business"
   * - "acid"
   * - "lemonade"
   * - "night"
   * - "coffee"
   * - "winter"
   * - "dim"
   * - "nord"
   * - "sunset"
   *
   * @param {string} theme - The theme to set
   */
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    set({ theme });
  },
}));