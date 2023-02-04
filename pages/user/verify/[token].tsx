import React, {useEffect, useState} from "react"
import Head                     from 'next/head'
import {MyBackApi}              from "@root/src/classes/MyBackApi"
import {MyBackAppManager}       from "@root/src/classes/MyBackAppManager"
import {MyBackLocalStore}       from "@root/src/classes/MyBackLocalStore"
import {UserActionHandler}      from "@root/src/classes/UserActionHandler"
import {DatabaseConnection}     from "@root/src/utility/Database"
import {VerificationForm}       from "@root/stories/03-Organisms/VerificationForm/VerificationForm"
import StaticText               from "@root/config/Text"
import {VerificationFormFields} from "@root/config/Forms"

/**
 * Render the login page.
 *
 * @param {Field} fields
 *   The form fields to render.
 * @param {string} token
 *   The action token.
 * @param {boolean} tokenIsValid
 *   A boolean indicating if the token is valid.
 *
 * @constructor
 */
export default function Verify({fields, token, tokenIsValid}) {
  const [manager, managerSet] = useState(null)

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi(process.env.API_URL), localStore))
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <>
      <Head>
        <title>Verify to your account</title>
        <meta name="description" content="Login to your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <VerificationForm
          token={token}
          tokenIsValid={tokenIsValid}
          steps={fields}
          manager={manager}
          recoverableErrorMessage={StaticText.SignIn.recoverableError}
          unrecoverableErrorMessage={StaticText.SignIn.unrecoverableError}
        />
      </main>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const db                = await DatabaseConnection()
  const userActionHandler = UserActionHandler.create(db)
  let tokenIsValid        = false

  try {
    await userActionHandler.actionClaim(params.token)
    tokenIsValid = true
  }
  catch (e) {

  }

  return {
    props: {
      fields      : VerificationFormFields,
      token        : params.token,
      tokenIsValid: tokenIsValid
    }
  }
}
