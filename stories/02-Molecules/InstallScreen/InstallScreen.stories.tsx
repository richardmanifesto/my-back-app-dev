import React, {useRef, useState} from "react"

import {InstallScreen} from "./InstallScreen"

export default {
  title    : "02-Molecules/InstallScreen",
  component: InstallScreen,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({}) => {
  return (
    <InstallScreen onNext={() => console.log("skip")} />
  )
}

export const InstallScreenExample = Template.bind({})
