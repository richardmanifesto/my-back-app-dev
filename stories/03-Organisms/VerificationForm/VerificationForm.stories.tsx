import React, {useEffect, useState} from "react"

import {VerificationForm} from "./VerificationForm"
import {VerificationFormFields} from "../../Data/Form"
import {MyBackLocalStore} from "@root/src/classes/MyBackLocalStore"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {MyBackApi}        from "@root/src/classes/MyBackApi"
import {swUserVerify} from "../../Utility/ServiceWorkerMocks"

export default {
  title     : "03-Organisms/VerificationForm",
  component : VerificationForm,
  parameters: {
    layout: 'fullscreen'
  }
}

const Template = ({steps, recoverableError, tokenIsValid, unrecoverableError}) => {
  const [manager, managerSet] = useState(null)

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi('http://localhost:6006'), localStore))
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <VerificationForm steps={steps} manager={manager} recoverableErrorMessage={recoverableError} token={"1234"} tokenIsValid={tokenIsValid} unrecoverableErrorMessage={unrecoverableError} />
  )
}

export const VerificationFormExample = Template.bind({})
VerificationFormExample.args = {
  steps             : VerificationFormFields,
  recoverableError  : "Please check your login details",
  unrecoverableError: "An unexpected error occurred, please try again",
  tokenIsValid      : true
}

VerificationFormExample.parameters = {
  msw: {
    handlers: [
      swUserVerify()
    ]
  }
}

export const VerificationFormInvalidTokenExample = Template.bind({})
VerificationFormInvalidTokenExample.args = {
  steps             : VerificationFormFields,
  recoverableError  : "Please check your login details",
  unrecoverableError: "An unexpected error occurred, please try again",
  tokenIsValid      : false
}

VerificationFormInvalidTokenExample.parameters = {
  msw: {
    handlers: [
      swUserVerify(true)
    ]
  }
}

export const VerificationFormWithApiErrorExample = Template.bind({})
VerificationFormWithApiErrorExample.args = {
  steps             : VerificationFormFields,
  recoverableError  : "Please check your login details",
  unrecoverableError: "An unexpected error occurred, please try again",
  tokenIsValid      : true
}

VerificationFormWithApiErrorExample.parameters = {
  msw: {
    handlers: [
      swUserVerify(true)
    ]
  }
}
