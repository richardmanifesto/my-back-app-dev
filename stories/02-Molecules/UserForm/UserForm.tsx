import React, {ReactNode} from "react"
import {Field}            from "@root/src/types/Field"
import {TopBar}           from "../../01-Atoms/TopBar/TopBar"
import {WebForm}          from "../../02-Molecules/WebForm/WebForm"
import {ProgressSpinner}  from "../..//01-Atoms/ProgressSpinner/ProgressSpinner"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"

/**
 * UserFormArgs.
 */
type UserFormArgs = {
  fields             : Array<Field>,
  footer             : ReactNode
  formTitle?         : string
  hasSubmitted       : boolean
  isSubmitting       : null
  onErrorClear       : () => void
  onSubmit           : (values: {}) => void
  recoverableError?  : string
  showLogo           : boolean
  success            : ReactNode
  topBarLabel        : string
  unrecoverableError?: string
}

/**
 * UserForm.
 *
 * @param {Field} fields
 *   The form fields to render.
 * @param {MyBackAppManager} manager
 *   An instantiated MyBackAppManager object.
 *
 * @constructor
 */
export const UserForm = ({fields, footer = null, formTitle = "", hasSubmitted, isSubmitting, onErrorClear, onSubmit, recoverableError = null, success, showLogo = false, topBarLabel, unrecoverableError = null}: UserFormArgs) => {
  return (
    <section className={"m-user-form"}>
      {topBarLabel &&
        <div className={"m-user-form__top-bar"}>
          <TopBar label={topBarLabel} />
        </div>
      }

      {showLogo &&
        <div className={"m-user-form__title"}>
          <h1>MyBackApp</h1>
        </div>
      }

      <div className={"m-user-form__main"}>
        {formTitle &&
          <div className={"m-user-form__main-form-title"}>
            <h1>{formTitle}</h1>
          </div>
        }

        {recoverableError &&
          <div className={"m-user-form__error-recoverable"}>
            <div className={"m-user-form__error-recoverable-inner"}>
              {recoverableError}
            </div>
          </div>
        }

        {unrecoverableError ?
          <div className={"m-user-form__error-unrecoverable"}>
            <div className={"m-user-form__error-unrecoverable-inner"}>
              <p>{unrecoverableError}</p>

              <p><button onClick={onErrorClear}>Try again</button></p>
            </div>
          </div> :
          <>
            {hasSubmitted ?
              <div className={"m-user-form__submit-success"}>
                <div className={"m-user-form__submit-success-inner"}>{success}</div>
              </div> :
              <WebForm fields={fields} onSubmit={onSubmit} />
            }
          </>
        }

        {isSubmitting && <ProgressSpinner message={""} />}
      </div>

      {footer && <div className={"m-user-form__footer"}>{footer}</div>}
    </section>
  )
}