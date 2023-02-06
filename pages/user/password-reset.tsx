import React, {useEffect, useState} from "react"
import Head                from 'next/head'
import {MyBackApi}         from "@root/src/classes/MyBackApi"
import {MyBackAppManager}  from "@root/src/classes/MyBackAppManager"
import {MyBackLocalStore}  from "@root/src/classes/MyBackLocalStore"
import {PasswordResetForm} from "@root/stories/03-Organisms/PasswordResetForm/PasswordResetForm"
import StaticText          from "@root/config/Text"
import {PasswordResetFields} from "@root/config/Forms"

/**
 * Render the login page.
 *
 * @param {Field} fields
 *   The form fields to render.
 *
 * @constructor
 */
export default function PasswordReset({fields}) {
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
        <title>Sign up</title>
        <meta name="description" content="Sign up now" />
      </Head>
      <main>
        <PasswordResetForm
          fields={fields}
          manager={manager}
          recoverableErrorMessage={StaticText.PasswordReset.recoverableError}
          unrecoverableErrorMessage={StaticText.PasswordReset.unrecoverableError}
        />
      </main>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      fields: PasswordResetFields
    }
  }
}
