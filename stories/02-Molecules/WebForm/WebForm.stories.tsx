import React from "react"

import {WebForm} from "./WebForm"

export default {
  title    : "02-Molecules/WebForm",
  component: WebForm,
  parameters: {
    rootStyle: 'blue',
    layout: 'fullscreen',
  }
}

const Template = ({fields}) => {
  return (
    <WebForm fields={fields} onSubmit={(values) => {
      console.log("values", values)
    }} />
  )
}

export const SignUpWebFormExample = Template.bind({})
SignUpWebFormExample.args = {
  fields: [
    {
      name         : "first_name",
      label        : "First name",
      type         : "text",
      required     : true,
      errorMessages: {
        required: "Please provide your first name"
      }
    },
    {
      name    : "last_name",
      label   : "Last name",
      type    : "text",
      required: true,
      errorMessages: {
        required: "Please provide your last name"
      }
    },
    {
      name    : "email_address",
      label   : "Email address",
      type    : "email",
      required: true,
      errorMessages: {
        required: "Please provide an email address",
        email   : "Please enter a valid email address"
      }
    },
    {
      name : "submit",
      label: "Creat your account",
      type : "submit",
    },
    {
      name: "terms",
      label: "",
      type : "markup",
      value: "<small>By creating an account you agree to the <a href={\"#\"} >Terms of use</a></small>"
    }
  ]
}

export const PasswordConfirmWebFormExample = Template.bind({})
PasswordConfirmWebFormExample.args = {
  fields: [
    {
      name    : "password",
      label   : "Password",
      type    : "password",
      required: true,
      errorMessages: {
        required: "Please provide a password"
      }
    },
    {
      name         : "password_confirm",
      label        : "Confirm password",
      type         : "password",
      required     : true,
      equals       : "password",
      errorMessages: {
        required: "Please confirm your password",
        equals  : "Please check your password"
      }
    },
    {
      name : "submit",
      label: "Creat your account",
      type : "submit",
    },
  ]
}

export const GoalsWebFormExample = Template.bind({})
GoalsWebFormExample.args = {
  fields: [
    {
      name    : "goal",
      label   : "What’s your primary goal?",
      type    : "radios",
      options : [
        {value: "manage",     label: "Manage my back pain"},
        {value: "recover",    label: "Recover from my injury"},
        {value: "strength",   label: "Build my strength"},
        {value: "specialist", label: "Find a specialist"},
      ],
      required: true,
      errorMessages: {
        required: "Please select a goal"
      }
    },
    {
      name : "submit",
      label: "Creat your account",
      type : "submit",
    },
  ]
}
