import React, {useEffect, useState} from "react"
import Head               from 'next/head'
import {MyBackApi}        from "@root/src/classes/MyBackApi"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {MyBackLocalStore} from "@root/src/classes/MyBackLocalStore"
import {SignInForm}       from "@root/stories/03-Organisms/SignInForm/SignInForm"
import StaticText         from "@root/config/Text"
import {SignInFormFields} from "@root/config/Forms"

/**
 * Render the login page.
 *
 * @param {Field} fields
 *   The form fields to render.
 *
 * @constructor
 */
export default function Login({fields}) {
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
        <title>Login to your account</title>
        <meta name="description" content="Login to your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <SignInForm
          fields={fields}
          manager={manager}
          recoverableErrorMessage={StaticText.SignIn.recoverableError}
          unrecoverableErrorMessage={StaticText.SignIn.unrecoverableError}
        />
      </main>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      fields: SignInFormFields
    }
  }
}
