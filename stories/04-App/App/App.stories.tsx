import React, {useEffect, useState} from "react"

import {App} from "./App"
import {ActivityGroups} from "../../Data/ActivityGroups"
import {ExampleVideos} from "../../Data/Videos"
import {swRetrieveActivitiesForDate, swSaveActivitiesForDate} from "../../Utility/ServiceWorkerMocks";
import {HomeScreenExample} from "../../03-Organisms/HomeScreen/HomeScreen.stories";


export default {
  title     : "04-App/App",
  component : App,
  parameters: {
    layout: 'fullscreen'
  }
}

const Template = ({baseUrl, currentDate, groups, videos, welcomeMessage}) => {
  return (
    <App baseUrl={baseUrl} videos={videos} currentDate={currentDate} groups={groups} welcomeMessage={welcomeMessage} />
  )
}

export const AppExample = Template.bind({})
AppExample.args = {
  baseUrl       : 'http://localhost:6006',
  currentDate   : new Date(),
  groups        : ActivityGroups,
  videos        : ExampleVideos,
  welcomeMessage: "Hello James, how are you?",
}

AppExample.parameters = {
  msw: {
    handlers: [
      swRetrieveActivitiesForDate(),
      swSaveActivitiesForDate()
    ]
  }
}