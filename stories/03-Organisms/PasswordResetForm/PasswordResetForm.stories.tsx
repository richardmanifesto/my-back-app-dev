import React, {useEffect, useState} from "react"

import {PasswordResetForm}   from "./PasswordResetForm"
import {MyBackLocalStore}    from "../../../src/classes/MyBackLocalStore"
import {MyBackAppManager}    from "../../../src/classes/MyBackAppManager"
import {MyBackApi}           from "../../../src/classes/MyBackApi"
import {swUserPasswordReset} from "../../Utility/ServiceWorkerMocks"
import {PasswordResetFields} from "../../Data/Form"


export default {
  title    : "03-Organisms/PasswordResetForm",
  component: PasswordResetForm,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    fields            : PasswordResetFields,
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
    <PasswordResetForm manager={manager} fields={fields} recoverableErrorMessage={recoverableError} unrecoverableErrorMessage={unrecoverableError} />
  )
}

export const PasswordResetFormExample = Template.bind({})
PasswordResetFormExample.parameters = {
  msw: {
    handlers: [
      swUserPasswordReset()
    ]
  }
}

export const PasswordResetFormExampleWithApiErrorExample = Template.bind({})
PasswordResetFormExampleWithApiErrorExample.parameters = {
  msw: {
    handlers: [
      swUserPasswordReset(true)
    ]
  }
}

