import React, {useState}  from "react"
import {Field}            from "@root/src/types/Field"
import {UserForm}         from "../../02-Molecules/UserForm/UserForm"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {ErrorResponse}    from "@root/src/classes/ErrorResponse"

/**
 * SignUpFormArgs.
 */
type SignUpFormArgs = {
  fields                   : Array<Field>
  manager                  : MyBackAppManager
  recoverableErrorMessage  : string
  unrecoverableErrorMessage: string
}

/**
 * SignUpForm.
 *
 * @param {Field} fields
 *   The form fields to render.
 * @param {MyBackAppManager} manager
 *   An instantiated MyBackAppManager object.
 * @param {string} recoverableError
 *   The message to display when a recoverable error is encountered.
 * @param {string} unrecoverableErrorMessage
 *   The message to display when an unrecoverable error is encountered.
 *
 * @constructor
 */
export const SignUpForm = ({fields, manager, recoverableErrorMessage, unrecoverableErrorMessage}: SignUpFormArgs) => {
  const [isSubmitting, isSubmittingSet]             = useState(null)
  const [hasSubmitted, hasSubmittedSet]             = useState(false)
  const [recoverableError, recoverableErrorSet]     = useState("")
  const [unrecoverableError, unrecoverableErrorSet] = useState("")

  const submitHandler = (values) => {
    recoverableErrorSet("")
    isSubmittingSet(true)

    manager.api.userRegister(values)
      .then(response => {
        hasSubmittedSet(true)
        isSubmittingSet(false)

        if (response.verificationToken) {
          recoverableErrorSet(`/user/verify/${response.verificationToken}`)
        }
      })
      .catch((error: ErrorResponse) => {
        console.error(error.message)
        recoverableErrorSet(unrecoverableErrorMessage)
        isSubmittingSet(false)
      })
  }

  const success = <>
    <h2>Thank you for registering</h2>
    <p>Please check your email for next steps</p>
  </>

  const footer = <>
    <p>Already have an account?</p>
    <p><a href={"/user/login"}>Login here</a></p>
  </>

  return (
    <UserForm
      fields={fields}
      footer={footer}
      hasSubmitted={hasSubmitted}
      isSubmitting={isSubmitting}
      onErrorClear={() => unrecoverableErrorSet("")}
      onSubmit={submitHandler}
      showLogo={false}
      success={success}
      topBarLabel={"Create an account"}
      recoverableError={recoverableError}
      unrecoverableError={unrecoverableError}
    />
  )
}