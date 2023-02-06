import React, {useState}   from "react"
import {Field}             from "@root/src/types/Field"
import {MyBackAppManager}  from "@root/src/classes/MyBackAppManager"
import {ErrorResponse}     from "@root/src/classes/ErrorResponse"
import {UserForm}          from "../../02-Molecules/UserForm/UserForm"
import {cookieSet}         from "@root/src/utility/Cookie"


/**
 * SignInFormArgs.
 */
export type SignInFormArgs = {
  fields                   : Array<Field>
  manager                  : MyBackAppManager
  recoverableErrorMessage  : string
  unrecoverableErrorMessage: string
}

/**
 * SignInForm.
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
export const SignInForm = ({fields, manager, recoverableErrorMessage, unrecoverableErrorMessage}: SignInFormArgs) => {
  const [isSubmitting, isSubmittingSet]             = useState(null)
  const [recoverableError, recoverableErrorSet]     = useState("")
  const [unrecoverableError, unrecoverableErrorSet] = useState("")

  /**
   * Handler the submit action.
   *
   * @param {{email_address: string, password: string}} values
   *   The form values.
   */
  const submitHandler = (values: {email_address: string, password: string}) => {
    isSubmittingSet(true)
    recoverableErrorSet("")

    manager.api.userLogin(values.email_address, values.password)
      .then(sessionData => {
        cookieSet("session", sessionData.sessionId)
        window.location.href = "/"
      })
      .catch((error: ErrorResponse) => {
        if (error.responseCodeGet() === 404) {
          recoverableErrorSet(recoverableErrorMessage)
        }
        else {
          unrecoverableErrorSet(unrecoverableErrorMessage)
        }

        isSubmittingSet(false)
      })
  }


  const footer = <>
    <p>Don't have an account?</p>
    <p><a href={"/user/register"}>Create one here</a></p>
  </>

  return (
    <UserForm
      fields={fields}
      footer={footer}
      hasSubmitted={false}
      isSubmitting={isSubmitting}
      onErrorClear={() => unrecoverableErrorSet("")}
      onSubmit={submitHandler}
      showLogo={true}
      success={null}
      topBarLabel={null}
      recoverableError={recoverableError}
      unrecoverableError={unrecoverableError}
    />
  )
}