import React, {useEffect, useRef, useState} from "react"

/**
 * VideoArgs.
 */
export type VideoArgs = {
  key?         : string
  description  : string
  externalStop : string
  id           : string
  onStateChange: (arg0: string) => void
  title        : string
  videoId      : string
  ytIsReady    : boolean
}

/**
 * Video.
 *
 * @param {string} description
 *   The video description.
 * @param {string} externalStop
 *   A flag to indicate if an external stop has been triggered.
 * @param {string} id
 *   The element ID
 * @param {(arg0: string) => void} onStateChange
 *   Callback for the play state change.
 * @param {string} title
 *   The video title.
 * @param {string} videoId
 *   The YT video ID
 * @param {boolean} ytIsReady
 *   A boolean indicating if the Youtube library has been initialised.
 * @constructor
 */
export const Video = ({description, externalStop, id, onStateChange, title, videoId, ytIsReady} : VideoArgs) => {
  const [player, playerSet] = useState(null)
  const videoRef = useRef(null)
  const observer = useRef(null)
  const playerId = `video-${id}`

  /**
   * Handle the player state change.
   *
   * @param {{data: int}} event
   *   The triggered event.
   */
  const handlerPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING) {
      onStateChange(videoId)
    }
  }

  /**
   * Handle the video is visible.
   *
   * @param {Array<IntersectionObserverEntry>} entries
   *   The entries provide.
   */
  const handleVideoIsVisible = (entries) => {
    if (entries[0].isIntersecting) {
      playerCreate()
      observer.current.unobserve(videoRef.current)
    }
  }

  /**
   * Create the player element.
   */
  const playerCreate = () => {
    const ytPlayer = new YT.Player(playerId, {
      videoId   : videoId,
      width     : '100%',
      height    : '100%',
      playerVars: {
        autoplay      : false,
        disablekb     : 0,
        fs            : 0,
        controls      : 1,
        modestbranding: 0,
        playsinline   : 0,
        enablejsapi   : 1,
        origin        : '*',
      },
      events: {
        'onStateChange': handlerPlayerStateChange,
      }
    })

    playerSet(ytPlayer)
  }

  useEffect(() => {
    if (ytIsReady && videoRef.current) {
      observer.current = new IntersectionObserver(handleVideoIsVisible, {
        rootMargin: "0px",
        threshold : 0.2
      })

      observer.current.observe(videoRef.current)
    }
  }, [videoRef, ytIsReady])


  useEffect(() => {
    if (externalStop && externalStop !== `${videoId}_stop` ) {
      if (player) {
        player.pauseVideo()
      }
    }
  }, [externalStop])

  return (
    <article className={"a-video"}>
      <div className={"a-video__player-wrap"}>
        <div id={playerId} ref={videoRef} />
      </div>

      {title && <div className={"a-video__title"}><h3>{title}</h3></div>}

      {description && <div className={"a-video__description"}>{description}</div>}
    </article>
  )
}