import React, {useEffect, useState} from "react"
import {ActivityManager}    from "./ActivityManager"
import {ActivityGroups}     from "../../Data/ActivityGroups"
import {swRetrieveActivitiesForDate, swSaveActivitiesForDate} from "../../Utility/ServiceWorkerMocks"
import {MyBackLocalStore} from "@root/src/classes/MyBackLocalStore"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {MyBackApi}        from "@root/src/classes/MyBackApi"

export default {
  title    : "03-Organisms/ActivityManager",
  component: ActivityManager,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({groups, date, currentDate}) => {
  const [manager, managerSet] = useState(null)
  const [open, openSet]       = useState(true)

  const handlerOnClose = (pendingUpdate: boolean = false) => {
    openSet(false)
  }

  useEffect(() => {
    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi('http://localhost:6006'), localStore))
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      {open && <ActivityManager
        manager={manager}
        groups={groups}
        date={date}
        currentDate={currentDate}
        onClose={handlerOnClose}
      />}
    </div>

  )
}

export const CurrentDayExample = Template.bind({})
CurrentDayExample.args = {
  date       : new Date(),
  currentDate: new Date(),
  groups     : ActivityGroups
}

CurrentDayExample.parameters = {
  msw: {
    handlers: [
      swRetrieveActivitiesForDate(),
      swSaveActivitiesForDate()
    ]
  }
}

export const ApiErrorExample = Template.bind({})
ApiErrorExample.args = {
  date       : new Date(),
  currentDate: new Date(),
  groups     : ActivityGroups
}

ApiErrorExample.parameters = {
  msw: {
    handlers: [
      swRetrieveActivitiesForDate(true),
      swSaveActivitiesForDate(true)
    ]
  }
}

const previousDate = new Date()
previousDate.setDate(previousDate.getDate() - 1)

export const PreviousDayExample = Template.bind({})
PreviousDayExample.args = {
  date       : new Date(),
  currentDate: previousDate,
  groups     : ActivityGroups
}

PreviousDayExample.parameters = {
  msw: {
    handlers: [
      swRetrieveActivitiesForDate()
    ]
  }
}

