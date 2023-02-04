import React from "react"
import { Meta, Story } from "@storybook/react";

import {ActivityInput} from "./ActivityInput"
import {ActivityInputArgs} from "@root/src/types/ActivityInputArgs"

export default {
  title    : "02-Molecules/ActivityInput",
  component: ActivityInput,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template: Story = ({bounds, type, label, name, value, options}: ActivityInputArgs) => {
  const handleValueChange = (inputValue) => {
    console.log(inputValue)
  }

  return (
    <ActivityInput
      bounds={bounds}
      label={label}
      options={options}
      name={name}
      type={type}
      onChange={handleValueChange}
      value={value}
    />
  )
}

export const NumberInputExample = Template.bind({})
NumberInputExample.args = {
  activityType: "sleep",
  label       : "How long did you sleep for?",
  name        : "sleep_value",
  type        : "number",
  placeholder : "1",
  value       : null,
}


export const SelectInputExample = Template.bind({})
SelectInputExample.args = {
  activityType: "exercise",
  label       : "Have you done your exercise?",
  name        : "exercise_value",
  type        : "select",
  value       : null,
  options     : [
    {value: "y", label: "Yes"},
    {value: "n", label: "No"}
  ]
}

export const RangeInputExample = Template.bind({})
RangeInputExample.args = {
  activityType: "sleep",
  label       : "How did you sleep",
  name        : "sleep_quality",
  type        : "range",
  bounds      : {
    max         : {
      label: "like a dream",
      value: 12
    },
    min: {
      label: "terribly",
      value: 0
    }
  },
  value: null
}

