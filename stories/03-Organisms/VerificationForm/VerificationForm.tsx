import React, {useEffect, useState}  from "react"
import {WelcomeScreen}    from "../../02-Molecules/WelcomeScreen/WelcomeScreen"
import {Field}            from "@root/src/types/Field"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {ResponsiveImage}  from "@root/src/types/ResponsiveImage"
import {ErrorResponse}    from "@root/src/classes/ErrorResponse"
import {UserForm}         from "../../02-Molecules/UserForm/UserForm"
import {cookieSet}        from "@root/src/utility/Cookie"
import {InstallScreen}    from "../../02-Molecules/InstallScreen/InstallScreen"
import {Browser}          from "../../Utility/Browser"

/**
 * InstallFormStep.
 */
type InstallFormStep = {
  shouldSubmit: boolean
  type        : string
}


/**
 * FieldsFormStep.
 */
type FieldsFormStep = {
  fields      : Array<Field>
  shouldSubmit: boolean
  title       : string
  type        : string
}

/**
 * WelcomeMessageFormStep.
 */
type WelcomeMessageFormStep = {
  data: {
    message: string
    image  : ResponsiveImage
  }
  shouldSubmit: boolean
  title       : string
  type        : string
}

/**
 * SignUpFormArgs.
 */
type VerificationFormArgs = {
  steps                    : Array<FieldsFormStep|InstallFormStep|WelcomeMessageFormStep>
  manager                  : MyBackAppManager
  recoverableErrorMessage  : string
  token                    : string
  tokenIsValid             : boolean
  unrecoverableErrorMessage: string
}

/**
 * Field step type predicate.
 *
 * @param {FieldsFormStep|WelcomeMessageFormStep} step
 *   The step to test
 */
const stepIsFieldStep = (step: FieldsFormStep|InstallFormStep|WelcomeMessageFormStep): step is FieldsFormStep => {
  return step.type === "form"
}

/**
 * Install prompt step type predicate.
 *
 * @param {FieldsFormStep|WelcomeMessageFormStep} step
 *   The step to test
 */
const stepIsInstallStep = (step: FieldsFormStep|InstallFormStep|WelcomeMessageFormStep): step is InstallFormStep => {
  return step.type === "install_prompt"
}

/**
 * Welcome message type predicate.
 *
 * @param {FieldsFormStep|WelcomeMessageFormStep} step
 *   The step to test
 */
const stepIsWelcomeStep= (step: FieldsFormStep|InstallFormStep|WelcomeMessageFormStep): step is WelcomeMessageFormStep => {
  return step.type === "welcome"
}


export const VerificationForm = ({ steps, manager, recoverableErrorMessage, token, tokenIsValid, unrecoverableErrorMessage }: VerificationFormArgs) => {
  const [isSubmitting, isSubmittingSet]             = useState(null)
  const [hasSubmitted, hasSubmittedSet]             = useState(false)
  const [recoverableError, recoverableErrorSet]     = useState("")
  const [unrecoverableError, unrecoverableErrorSet] = useState(tokenIsValid ? "" : "Token has expired")
  const [currentStep, currentStepSet]               = useState(0)
  const [values, valuesSet]                         = useState({})

  const validSteps = (Browser.navigatorIsMac() && !Browser.isChrome()) ? steps.filter(step => step.type !== "install_prompt") : steps

  const currentStepData = validSteps[currentStep]

  /**
   * Handler the form step complete.
   *
   * @param {{}} stepValues
   *   The step values.
   */
  const handleFormStepComplete = (stepValues: {}) => {
    if (currentStepData.shouldSubmit) {
      isSubmittingSet(true)

      manager.api.meVerify({...stepValues, ...{token: token}})
        .then((sessionData) => {
          cookieSet("session", sessionData.sessionId)

          if(currentStep === validSteps.length -1) {
            window.location.href = "/"
          }
          else {
            isSubmittingSet(false)
            currentStepSet(currentStep +1)
          }

        })
        .catch((error: ErrorResponse) => {
          console.error(error.message)
          recoverableErrorSet(unrecoverableErrorMessage)
          isSubmittingSet(false)
        })
    }
    else if(currentStep === validSteps.length -1) {
      window.location.href = "/"
    }
    else {
      valuesSet({...values, ...values})
      currentStepSet(currentStep +1)
    }
  }


  if (stepIsWelcomeStep(currentStepData)) {
    return (
      <WelcomeScreen welcomeMessage={currentStepData.data.message} image={currentStepData.data.image} onNext={handleFormStepComplete} />
    )
  }
  else if (stepIsFieldStep(currentStepData)){
    return (
      <div className={"o-validation-form"}>
        <UserForm
          fields={currentStepData.fields}
          footer={null}
          formTitle={currentStepData.title}
          hasSubmitted={hasSubmitted}
          isSubmitting={isSubmitting}
          onErrorClear={() => unrecoverableErrorSet("")}
          onSubmit={handleFormStepComplete}
          showLogo={false}
          success={null}
          topBarLabel={""}
          recoverableError={recoverableError}
          unrecoverableError={unrecoverableError}
        />
      </div>

    )
  }
  else if (stepIsInstallStep(currentStepData)) {
    return (
      <InstallScreen onNext={handleFormStepComplete} />
    )
  }




  return (
    <div/>
  )
}