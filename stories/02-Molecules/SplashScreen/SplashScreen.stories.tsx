import React from "react"

import {SplashScreen} from "./SplashScreen"

export default {
  title    : "02-Molecules/SplashScreen",
  component: SplashScreen,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = () => {
  return (
    <SplashScreen  />
  )
}

export const SplashScreenExample = Template.bind({})

