export const Browser = {
  navigatorIsiOs: (): boolean => {
    return typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  navigatorIsMac: (): boolean => {
    return typeof window !== 'undefined' && /Mac/.test(navigator.userAgent) && !window.MSStream;
  },

  isChrome() {
    return typeof window !== 'undefined' && /Chrome/.test(navigator.userAgent)
  }
}