import React, {useEffect, useState} from "react"

import {Diary} from "./Diary"
import {BottomBar}        from "../../02-Molecules/BottomBar/BottomBar"
import {ActivityGroups}   from "../../Data/ActivityGroups"
import {MyBackLocalStore} from "../../../src/classes/MyBackLocalStore"
import {MyBackAppManager} from "../../../src/classes/MyBackAppManager"
import {MyBackApi}        from "../../../src/classes/MyBackApi"
export default {
  title    : "03-Organisms/Diary",
  component: Diary,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({ currentDate, groups }) => {
  const [manager, managerSet] = useState(null)

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi('http://localhost:6006'), localStore))
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      <Diary manager={manager} currentDate={currentDate} groups={groups} />
      <BottomBar onTabSelected={() => {}} />
    </div>
  )
}

export const CurrentDateExample = Template.bind({})
CurrentDateExample.args = {
  currentDate: new Date(),
  groups     : ActivityGroups
}