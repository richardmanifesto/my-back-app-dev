export const youtubeLoad = (callback: Function) => {
  // @ts-ignore
  window.onYouTubeIframeAPIReady = () => {
    console.log("onYouTubeIframeAPIReady")
    callback()
  }

  // @ts-ignore
  if ((typeof YT !== "undefined") && YT && YT.Player) {
    console.log("callback")
    callback()
  }
  else {
    const tag = document.createElement('script')
    const firstScriptTag = document.getElementsByTagName('script')[0]

    tag.src = 'https://www.youtube.com/iframe_api'
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  }
}