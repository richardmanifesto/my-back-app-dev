import React, {useEffect, useState} from "react"

import {SignUpForm}       from "./SignUpForm"
import {MyBackLocalStore} from "../../../src/classes/MyBackLocalStore"
import {MyBackAppManager} from "../../../src/classes/MyBackAppManager"
import {MyBackApi}        from "../../../src/classes/MyBackApi"
import {swUserRegister}   from "../../Utility/ServiceWorkerMocks"
import {SignUpFormFields} from "../../Data/Form"

export default {
  title    : "03-Organisms/SignUpForm",
  component: SignUpForm,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    fields            : SignUpFormFields,
    recoverableError  : "Please check your login details",
    unrecoverableError: "An unexpected error occurred, please try again",
  }
}

const Template = ({fields, recoverableErrorMessage, unrecoverableError}) => {
  const [manager, managerSet] = useState(null)

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi('http://localhost:6006'), localStore))
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <SignUpForm fields={fields} manager={manager} recoverableErrorMessage={recoverableErrorMessage} unrecoverableErrorMessage={unrecoverableError}/>
  )
}

export const SignUpFormExample = Template.bind({})
SignUpFormExample.parameters = {
  msw: {
    handlers: [
      swUserRegister()
    ]
  }
}

export const SignUpFormApiErrorExample = Template.bind({})
SignUpFormApiErrorExample.parameters = {
  msw: {
    handlers: [
      swUserRegister(true)
    ]
  }
}

