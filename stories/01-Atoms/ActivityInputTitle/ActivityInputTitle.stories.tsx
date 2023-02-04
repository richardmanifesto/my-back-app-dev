import React from "react"

import {ActivityInputTitle} from "./ActivityInputTitle"

export default {
  title    : "1-Atoms/ActivityInputTitle",
  component: ActivityInputTitle
}

const Template = ({options}) => {
  return (
    <ul className={"example-list"}>
      {options.map(option => {
        return(
          <li>
            <ActivityInputTitle activityType={option.type} label={option.label} />
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
      type : "sleep",
      label: "Sleep"
    },
    {
      type : "walking",
      label: "Walking"
    },
    {
      type : "sitting",
      label: "Sitting"
    },
    {
      type : "steps",
      label: "Steps"
    }
  ]
}
