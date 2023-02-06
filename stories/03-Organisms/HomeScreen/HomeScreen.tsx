import React, {useEffect, useState} from "react"
import {ActivityIcon}               from "../../01-Atoms/ActivityIcon/ActivityIcon"
import {ActivityManager}            from "../ActivityManager/ActivityManager"
import {ActivityManagerGroupArgs}   from "../../02-Molecules/ActivityManagerGroup/ActivityManagerGroup"
import {MyBackAppManager}           from "@root/src/classes/MyBackAppManager"
import {SplashScreen}               from "../../02-Molecules/SplashScreen/SplashScreen"


export type HomeScreenArgs = {
  currentDate       : Date
  groups            : Array<ActivityManagerGroupArgs>
  manager           : MyBackAppManager
  welcomeMessage    : string
}

export const HomeScreen = ({currentDate, groups, manager, welcomeMessage}: HomeScreenArgs) => {
  const [selectedDate, selectedDateSet]   = useState<Date>(null)
  const [splash, splashSet] = useState("")
  const [currentValues, currentValuesSet] = useState(null)

  useEffect(() => {
    if (manager) {
      splashSet("ready")
      const startTime = Date.now()

      console.log("herre")

      manager.meActivityGetForDate(currentDate)
        .then(values => {
          const duration = Date.now() - startTime
          const delay = duration < 2000 ? 2000 - duration : 0

          setTimeout(() => {
            splashSet("exit")

            setTimeout(() => {
              currentValuesSet(values.activity_values)
            }, 800)

          }, delay)


        })
        .catch(error => {
          console.error(error)
        })
    }
  }, [manager])

  useEffect(() => {
    if (manager) {
      manager.localStoreGetActivityForDate(currentDate)
        .then(localValues => currentValuesSet(localValues.activity_values))
    }
  }, [selectedDate])

  return (
    <>
      {currentValues ?
        <section className={"o-home-screen"}>
          <div className={"o-home-screen__inner"}>
            <div className={"o-home-screen__logo"}>MyBackApp</div>

            <header>
              <div className={"o-home-screen__welcome-message"}>
                <h2>{welcomeMessage}</h2>
              </div>
            </header>

            <div className={"o-home-screen__main"}>
              <div className={"o-home-screen__main-action"}>
                <button className={"b-button-primary"} onClick={() => {
                  selectedDateSet(currentDate)
                }}>Update your day</button>
              </div>

              {currentValues &&
                <ul className={"o-home-screen__overview"}>
                  {groups.map((group, key) => {
                    const iconValue = currentValues[`${group.activityType}_value`] ? currentValues[`${group.activityType}_value`] : "0"

                    return (
                      <li key={key}>
                        <ActivityIcon label={group.label} suffix={group.suffix} type={group.activityType} value={iconValue} />
                      </li>
                    )
                  })}
                </ul>
              }

            </div>
          </div>

          {selectedDate &&
            <div className={"o-home-screen__activity-sheet"}>
              <ActivityManager manager={manager} groups={groups} date={selectedDate} currentDate={currentDate} onClose={() => {
                selectedDateSet(null)
              }} />
            </div>
          }
        </section> :
        <SplashScreen state={splash} />
      }
    </>
  )
}