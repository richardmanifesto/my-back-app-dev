import React, {useEffect, useState} from "react"
import {Image} from "../../01-Atoms/Image/Image"
import {ResponsiveImage} from "@root/src/types/ResponsiveImage"


/**
 * WelcomeScreenArgs.
 */
export type WelcomeScreenArgs = {
  welcomeMessage: string
  image         : ResponsiveImage,
  onNext        : Function
}


/**
 * WelcomeScreen.
 *
 * @param {string} welcomeMessage
 *   The welcome message to display.
 * @param {Image} image
 *   The image to display.
 * @param {Function} onNext
 *   On next callback.
 * @constructor
 */
export const WelcomeScreen = ({welcomeMessage, image, onNext}: WelcomeScreenArgs) => {
  const [initialised, initialisedSet] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      initialisedSet(true)
    }, 500)
  }, [])

  return (
    <div className={"m-welcome-screen"} data-initialised={initialised}>
      <div className={"m-welcome-screen__inner"}>
        <div className={"m-welcome-screen__title"}>
          <h1>{welcomeMessage}</h1>
        </div>
        <div className={"m-welcome-screen__image"}>
          <Image {...image} />
        </div>

        <div className={"m-welcome-screen__action"}>
          <button onClick={() => onNext({})}>Start</button>
        </div>
      </div>
    </div>
  )
}