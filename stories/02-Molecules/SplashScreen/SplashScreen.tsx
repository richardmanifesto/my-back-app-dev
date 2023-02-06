 import React from "react"

type SplashScreen = {
  state?: "ready"
}

/**
 * SplashScreen.
 *
 * @constructor
 */
export const SplashScreen = ({state}) => {
  return (
    <div className={"m-splash-screen"} data-state={state}>
      <div className={"m-splash-screen__wrap"}>
        <div className={"m-splash-screen__inner"}>
          <div className={"m-splash__title"}>
            <h1>MyBackApp</h1>
          </div>
        </div>
      </div>
    </div>
  )
}