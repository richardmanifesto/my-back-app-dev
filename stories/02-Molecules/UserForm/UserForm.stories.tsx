import React, {useEffect, useState} from "react"

import {UserForm}         from "./UserForm"
import {MyBackLocalStore} from "@root/src/classes/MyBackLocalStore"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {MyBackApi}        from "@root/src/classes/MyBackApi"
import {ErrorResponse}    from "@root/src/classes/ErrorResponse"
import {swUserRegister, swUserSessionCreate} from "../../Utility/ServiceWorkerMocks"
import {SignUpFormFields} from "../../Data/Form"

export default {
  title    : "02-Molecules/UserForm",
  component: UserForm,
  parameters: {
    layout: 'fullscreen',
  }
}
const handleSignInSubmit = (manager, values, recoverableErrorSet, isSubmittingSet, submittedSet, unrecoverableError) => {
  isSubmittingSet(true)
  recoverableErrorSet("")

  manager.api.userLogin(values.email_address, values.password)
    .then(sessionData => {
      window.location.href = "/"
    })
    .catch((error: ErrorResponse) => {
      if (error.responseCodeGet() === 404) {
        recoverableErrorSet("Please check your login details")
      }
      else {
        unrecoverableError(error.message)
      }

      isSubmittingSet(false)
    })
}

const handleSignUpSubmit = (manager, values, recoverableErrorSet, isSubmittingSet, submittedSet, unrecoverableError) => {
  isSubmittingSet(true)

  manager.api.userRegister(values)
    .then(() => {
      submittedSet(true)
      isSubmittingSet(false)
    })
    .catch((error: ErrorResponse) => {
      console.error((error))
      recoverableErrorSet("An unexpected error occurred. Please check your details and try again")
      isSubmittingSet(false)
    })
}

const Template = ({fields, footer, submitHandler, success, showLogo, topBarLabel}) => {
  const [manager, managerSet] = useState(null)
  const [isSubmitting, isSubmittingSet]             = useState(null)
  const [recoverableError, recoverableErrorSet]     = useState("")
  const [submitted, submittedSet]                   = useState(false)
  const [unrecoverableError, unrecoverableErrorSet] = useState("")

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi('http://localhost:6006'), localStore))
      })
      .catch(error => console.error(error))
  }, [])

  const handleSubmit = (values: {}) => {
    submitHandler(manager, values, recoverableErrorSet, isSubmittingSet, submittedSet, unrecoverableError)
  }

  return (
    <UserForm
      fields={fields}
      footer={footer}
      isSubmitting={isSubmitting}
      onErrorClear={() => unrecoverableErrorSet("")}
      onSubmit={handleSubmit}
      hasSubmitted={submitted}
      success={success}
      showLogo={showLogo}
      topBarLabel={topBarLabel}
      recoverableError={recoverableError}
      unrecoverableError={unrecoverableError}
    />
  )
}

export const SignUpFormExample = Template.bind({})
SignUpFormExample.args = {
  fields: SignUpFormFields,
  footer: <>
    <p>Already have an account?</p>
    <p><a href={"#"}>Login here</a></p>
  </>,
  submitHandler: handleSignUpSubmit,
  success: <>
    <h2>Thank you for registering</h2>
    <p>Please check your emails for next steps</p>
  </>,
  showLogo: false,
  topBarLabel: "Create an account"
}

SignUpFormExample.parameters = {
  msw: {
    handlers: [
      swUserRegister()
    ]
  }
}

export const SignInFormExample = Template.bind({})
SignInFormExample.args = {
  fields: SignUpFormFields,
  footer: <>
    <p>Don't have an account?</p>
    <p><a href={"#"}>Create one here</a></p>
  </>,
  submitHandler: handleSignInSubmit,
  success: <></>,
  showLogo: true
}

SignInFormExample.parameters = {
  msw: {
    handlers: [
      swUserSessionCreate()
    ]
  }
}

