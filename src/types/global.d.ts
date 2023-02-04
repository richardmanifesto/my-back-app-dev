export {}

declare global {
  const YT: {
    Player : (arg0: string, arg1: {}) => void
    PlayerState: {
      PLAYING: string
    }
  }

  interface Window {
    MSStream: boolean
    isStorybook: boolean
  }
}