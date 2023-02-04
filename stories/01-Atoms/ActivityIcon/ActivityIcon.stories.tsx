import React from "react"

import {ActivityIcon} from "./ActivityIcon"

export default {
  title    : "1-Atoms/ActivityIcon",
  component: ActivityIcon
}

const Template = ({options}) => {
  return (
    <ul className={"example-swatch-grid"}>
      {options.map(option => {
        return(
          <li>
            <ActivityIcon type={option.type} label={option.label} value={option.value} suffix={option.suffix} />
          </li>
        )
      })}
    </ul>
  )
}

export const ActivityIconsExample = Template.bind({})
ActivityIconsExample.args = {
  options: [
    {
      type  : "sleep",
      suffix: "hrs",
      label : "Sleep",
      value : "6.5hrs"
    },
    {
      type  : "walking",
      suffix: "km",
      label : "Walking",
      value : "1"
    },
    {
      type  : "sitting",
      suffix: "hrs",
      label : "Sitting",
      value : "3.5"
    },
    {
      type  : "steps",
      suffix: "",
      label : "Steps",
      value : "4,990"
    }
  ]
}
