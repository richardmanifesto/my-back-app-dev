import React from "react"

import {DiarySheet} from "./DiarySheet"

export default {
  title    : "02-Molecules/DiarySheet",
  component: DiarySheet,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({ activeDate, currentDate}) => {
  const selectHandler = (selectedDate: Date) => {
    console.log("selectHandler", selectedDate.toISOString())
  }

  return (
    <DiarySheet activeDate={activeDate} currentDate={currentDate} onSelect={selectHandler} />
  )
}

export const DiarySheetExample = Template.bind({})
DiarySheetExample.args = {
  activeDate : new Date(),
  currentDate: new Date()
}

