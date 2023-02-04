import React from "react"

import {TopBar} from "./TopBar"

export default {
  title    : "1-Atoms/TopBar",
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({label, backAction, backCta, backLink, forwardAction, forwardCta, forwardLink}) => {
  return (
    <TopBar label={label} backCta={backCta} backLink={backLink} doBackAction={backAction} forwardCta={forwardCta} forwardLink={forwardLink} doForwardAction={forwardAction} />
  )
}

export const TopBarExample = Template.bind({})
TopBarExample.args = {
  label: 'Create an account'
}

export const TopBarExampleWithBackLink = Template.bind({})
TopBarExampleWithBackLink.args = {
  label   : 'Create an account',
  backLink: '#',
  backCta : "Previous"
}

export const TopBarExampleWithForwardLink = Template.bind({})
TopBarExampleWithForwardLink.args = {
  label      : 'Create an account',
  forwardLink: '#',
  forwardCta : "Next"
}

export const TopBarExampleWithBackAction = Template.bind({})
TopBarExampleWithBackAction.args = {
  label      : 'Create an account',
  backAction: () => { console.log("backAction")}
}

export const TopBarExampleWithForwardAction = Template.bind({})
TopBarExampleWithForwardAction.args = {
  label         : 'Create an account',
  forwardAction: () => { console.log("forwardAction")}
}

export const TopBarExampleWithBackAndForwardAction = Template.bind({})
TopBarExampleWithBackAndForwardAction.args = {
  label         : 'Top bar with a long title',
  backAction    : () => { console.log("backAction")},
  forwardAction : () => { console.log("forwardAction")}
}