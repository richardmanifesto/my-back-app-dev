import React from "react"

import {BottomBar} from "./BottomBar"

export default {
  title    : "02-Molecules/BottomBar",
  component: BottomBar,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = () => {
  const handlerTabChange = (tabSelected: string) => {
    console.log("tabSelected", tabSelected)
  }

  return (
    <div>
      <BottomBar onTabSelected={handlerTabChange}/>
    </div>
  )
}

export const BottomBarExample = Template.bind({})
BottomBarExample.args = {

}
