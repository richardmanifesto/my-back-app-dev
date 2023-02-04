import React, {useEffect, useState} from "react"

import {SignInForm} from "./SignInForm"
import {MyBackLocalStore}    from "../../../src/classes/MyBackLocalStore"
import {MyBackAppManager}    from "../../../src/classes/MyBackAppManager"
import {MyBackApi}           from "../../../src/classes/MyBackApi"
import {swUserSessionCreate} from "../../Utility/ServiceWorkerMocks"
import {SignInFormFields}    from "../../Data/Form"


export default {
  title    : "03-Organisms/SignInForm",
  component: SignInForm,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    fields: SignInFormFields,
    recoverableError  : "Please check your login details",
    unrecoverableError: "An unexpected error occurred, please try again",
  }
}

const Template = ({fields, recoverableError, unrecoverableError}) => {
  const [manager, managerSet] = useState(null)

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi('http://localhost:6006'), localStore))
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <SignInForm manager={manager} fields={fields} recoverableErrorMessage={recoverableError} unrecoverableErrorMessage={unrecoverableError} />
  )
}

export const SignInFormExample = Template.bind({})
SignInFormExample.parameters = {
  msw: {
    handlers: [
      swUserSessionCreate()
    ]
  }
}

export const SignInFormWithInvalidCredentialsExample = Template.bind({})
SignInFormWithInvalidCredentialsExample.parameters = {
  msw: {
    handlers: [
      swUserSessionCreate(404)
    ]
  }
}

export const SignInFormWithApiErrorExample = Template.bind({})
SignInFormWithApiErrorExample.parameters = {
  msw: {
    handlers: [
      swUserSessionCreate(500)
    ]
  }
}

