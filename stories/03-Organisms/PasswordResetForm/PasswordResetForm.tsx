import React, {useState}   from "react"
import {Field}             from "@root/src/types/Field"
import {MyBackAppManager}  from "@root/src/classes/MyBackAppManager"
import {ErrorResponse}     from "@root/src/classes/ErrorResponse"
import {UserForm}          from "../../02-Molecules/UserForm/UserForm"
import {cookieSet}         from "../../Utility/Cookie"


/**
 * PasswordResetFormArgs.
 */
export type PasswordResetFormArgs = {
  fields                   : Array<Field>
  manager                  : MyBackAppManager
  recoverableErrorMessage  : string
  unrecoverableErrorMessage: string
}

/**
 * PasswordResetForm.
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
export const PasswordResetForm = ({fields, manager, recoverableErrorMessage, unrecoverableErrorMessage}: PasswordResetFormArgs) => {
  const [isSubmitting, isSubmittingSet]             = useState(null)
  const [hasSubmitted, hasSubmittedSet]             = useState(false)
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

    manager.api.userPasswordReset(values.email_address)
      .then(() => {
        hasSubmittedSet(true)
        isSubmittingSet(false)
      })
      .catch((error: ErrorResponse) => {
        if (error.responseCodeGet() === 404) {
          hasSubmittedSet(true)
          isSubmittingSet(false)
        }
        else {
          unrecoverableErrorSet(unrecoverableErrorMessage)
        }

        isSubmittingSet(false)
      })
  }

  const success = <>
    <h2>Thank you</h2>
    <p>Please check your email for next steps</p>
  </>


  const footer = <>
    <p>Back to the <a href={"/user/login"}>login screen</a></p>
  </>

  return (
    <UserForm
      fields={fields}
      footer={footer}
      hasSubmitted={hasSubmitted}
      isSubmitting={isSubmitting}
      onErrorClear={() => unrecoverableErrorSet("")}
      onSubmit={submitHandler}
      showLogo={true}
      formTitle={"Reset your password"}
      success={success}
      topBarLabel={null}
      recoverableError={recoverableError}
      unrecoverableError={unrecoverableError}
    />
  )
}