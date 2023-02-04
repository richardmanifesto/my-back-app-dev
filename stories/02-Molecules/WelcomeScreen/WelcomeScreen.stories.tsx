import React from "react"

import {WelcomeScreen, WelcomeScreenArgs} from "./WelcomeScreen"

export default {
  title    : "02-Molecules/WelcomeScreen",
  component: WelcomeScreen,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({welcomeMessage, image}: WelcomeScreenArgs) => {
  return (
    <WelcomeScreen welcomeMessage={welcomeMessage} image={image} onNext={() => console.log("next")} />
  )
}

export const WelcomeScreenExample = Template.bind({})
WelcomeScreenExample.args = {
  welcomeMessage: "Welcome! Let’s get started",
  image: {
    small: {
      src: "/images/welcome-screen-image--mobile.jpg",
      alt: "Image of exercise map"
    },
    medium: {
      src: "/images/welcome-screen-image--medium.jpg",
      alt: "Image of exercise map"
    },
    large: {
      src: "/images/welcome-screen-image--desktop.jpg",
      alt: "Image of exercise map"
    }
  }
}

