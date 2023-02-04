import React from "react"

import {RangeSlider} from "./RangeSlider"

export default {
  title    : "1-Atoms/RangeSlider",
  component: RangeSlider,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({label, name, max, min}) => {
  const handleValueChange = (value) => {
    console.log("value", value)
  }

  return (
    <div className={"b-container-slim"}>
      <RangeSlider onChange={handleValueChange} label={label} name={name} max={max} min={min} />
    </div>
  )
}

export const RangeSliderExample = Template.bind({})
RangeSliderExample.args = {
  label: "How did you sleep",
  name : "sleep",
  max: {
    label: "like a dream",
    value: 12
  },
  min: {
    label: "terribly",
    value: 0
  }
}
