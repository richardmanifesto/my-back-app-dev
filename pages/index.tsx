import Head from 'next/head'
import React, {useEffect}   from "react"
import {App}                from "@root/stories/04-App/App/App"
import {ActivityGroups}     from "@root/stories/Data/ActivityGroups"
import {ExampleVideos}      from "@root/stories/Data/Videos"
import {SessionHandler}     from "@root/src/classes/SessionHandler"
import {DatabaseConnection} from "@root/src/utility/Database"
import {UserHandler}        from "@root/src/classes/UserHandler"
import {UserRecord}         from "@root/src/types/UserRecord"
/**
 * Render the home page.
 * @constructor
 */
export default function Home({groups, videos, welcomeMessage}) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/mba-service-worker.js')
        .then(function() { console.log('Service Worker Registered') })
        .catch((error) => console.error("SE err", error))
    }
  }, [])


  return (
    <>
      <Head>
        <title>MyBackAp</title>
      </Head>
      <main>
        <App baseUrl={process.env.API_URL} videos={videos} currentDate={new Date()} groups={groups} welcomeMessage={welcomeMessage} />
      </main>
    </>
  )
}

export async function getServerSideProps({req}) {
  // Pass data to the page via props
  const sessionHandler = SessionHandler.create()
  const db             = await DatabaseConnection()
  const userHandler    = await UserHandler.create(db)

  let user: UserRecord = {
    ailment_description: "",
    date_of_birth      : "",
    email_address      : "",
    first_name         : "",
    last_name          : "",
    user_role          : ""
  }

  try {
    const sessionToken = SessionHandler.sessionTokenGet(req.headers.cookie)
    const claim        = await sessionHandler.tokenVerify(sessionToken)
    user               = await userHandler.userGetById(claim.userId)
  }
  catch (e) {
    
  }

  return {
    props: {
      groups        : ActivityGroups,
      videos        : ExampleVideos,
      welcomeMessage: `Hello ${user.first_name}, how are you?`,
    }
  }
}
