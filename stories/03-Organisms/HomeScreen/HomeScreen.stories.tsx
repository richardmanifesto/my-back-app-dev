import React, {useEffect, useState} from "react"

import {HomeScreen} from "./HomeScreen"
import {BottomBar} from "../../02-Molecules/BottomBar/BottomBar";
import {ActivityGroups} from "../../Data/ActivityGroups"
import {swRetrieveActivitiesForDate, swSaveActivitiesForDate} from "../../Utility/ServiceWorkerMocks";
import {CurrentDayExample} from "../ActivityManager/ActivityManager.stories";
import {MyBackLocalStore} from "../../../src/classes/MyBackLocalStore"
import {MyBackAppManager} from "../../../src/classes/MyBackAppManager"
import {MyBackApi}        from "../../../src/classes/MyBackApi"

export default {
  title    : "03-Organisms/HomeScreen",
  component: HomeScreen,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({ currentDate, groups, icons, welcomeMessage}) => {
  const [manager, managerSet] = useState(null)
  const [localStore, localStoreSet] = useState(null)

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi('http://localhost:6006'), localStore))
      })
      .catch(error => console.error(error))
  }, [])


  const handleCallback = () => {
    console.log("handleCallback")
  }

  const handlerTabChange = (tabSelected: string) => {
    console.log("tabSelected", tabSelected)
  }

  return (
    <div>
      <HomeScreen manager={manager} currentDate={currentDate} groups={groups} welcomeMessage={welcomeMessage} />
      <BottomBar onTabSelected={handlerTabChange} />
    </div>
  )
}

export const HomeScreenExample = Template.bind({})
HomeScreenExample.args = {
  currentDate: new Date(),
  groups     : ActivityGroups,
  welcomeMessage: "Hello James, how are you?",
  icons: ActivityGroups.map(group => {
    return {
      label : group.label,
      type  : group.activityType,
      suffix: group.suffix
    }
  })
}

HomeScreenExample.parameters = {
  msw: {
    handlers: [
      swRetrieveActivitiesForDate(),
      swSaveActivitiesForDate()
    ]
  }
}