import React from "react"
import { ProgressSpinner } from "./ProgressSpinner"

export default {
  title    : "1-Atoms/ProgressSpinner",
  component: ProgressSpinner
}

const Template = args => {
  return(
    <div style={{
      height: "50vh",
      width : " 100%"
    }}>
      <ProgressSpinner {...args} />
    </div>
  )
}

export const ProgressSpinnerExample = Template.bind({})
ProgressSpinnerExample.args = {
  message: ""
}
