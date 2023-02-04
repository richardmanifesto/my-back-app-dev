import React, {useState, useRef}  from "react"
import {MyBackAppManager}         from "../../00-Base/Classes/MyBackAppManager"
import {TopBar}                   from "../../01-Atoms/TopBar/TopBar"
import {ActivityManagerGroupArgs} from "../../02-Molecules/ActivityManagerGroup/ActivityManagerGroup"
import {DiarySheet}               from "../../02-Molecules/DiarySheet/DiarySheet"
import {Sheets}                   from "../../02-Molecules/Sheets/Sheets"
import {ActivityManager}          from "../ActivityManager/ActivityManager"
import {datesAreTheSame}          from "../../Utility/Date"

/**
 * DiaryArgs.
 */
export type DiaryArgs = {
  currentDate: Date
  groups     : Array<ActivityManagerGroupArgs>
  manager    : MyBackAppManager
}

/**
 * Diary.
 *
 * @param {Date} currentDate
 *   The current date - this is passed through as dependency to facilitate testing.
 * @param {Array<ActivityManagerGroupArgs>} groups
 *   The activity groups to render out.
 * @param {MyBackAppManager} manager
 *   An instantiated MyBackAppManager object.
 *
 * @constructor
 */
export const Diary = ({currentDate, groups, manager}: DiaryArgs) => {
  const [sheets, sheetsSet] = useState<Array<Date>>([currentDate])
  const [sheetIsExiting, sheetIsExitingSet] = useState<boolean>(false)
  const [selectedDate, selectedDateSet] = useState<Date>(null)
  const sheetsRef = useRef(null)

  const items = []
  const visibleDate = sheets[sheets.length -1]

  for(let i = 1; i < 32; i++) {
    items.push(i)
  }

  /**
   * Handle the forward action
   */
  const handlerDoForwardAction = () => {
    if (!sheetIsExiting) {
      sheetIsExitingSet(true)
      sheetsRef.current.removeLast()
    }
  }

  /**
   * Handle the select action.
   *
   * @param {Date} chosenDate
   *   The date that was chosen
   */
  const handleSelect = (chosenDate: Date) => {
    selectedDateSet(chosenDate)
  }

  /**
   * Get the formatted date for the header:
   */
  const headerGet = (): string => {
    return visibleDate.toLocaleDateString('en-gb',
      { year: 'numeric', month: 'short' }
    )
  }

  /***
   * Pop the last month from the list.
   */
  const popMonthFromStack = () => {
    sheets.pop()
    sheetsSet([...sheets])
    sheetIsExitingSet(false)
  }

  /**
   * Push a new month onto the list.
   */
  const pushMonthToStack = () => {
    const nextDate = new Date(visibleDate.toISOString())
    nextDate.setMonth(nextDate.getMonth() - 1)
    sheetsSet([...sheets, nextDate])
  }

  /**
   * Check if the vis
   */
  const visibleDateIsCurrentDate = () => {
    return datesAreTheSame(visibleDate, currentDate)
  }

  return (
    <article className={"o-diary"}>
      <header className={"o-diary__header"}>
        <TopBar label={headerGet()} doBackAction={pushMonthToStack} doForwardAction={visibleDateIsCurrentDate() ? null : () => handlerDoForwardAction()}  />
      </header>

      <Sheets ref={sheetsRef} onItemRemove={popMonthFromStack} shouldRemove={false}>
        {sheets.map((sheetDate, key) => {
          return (
            <DiarySheet key={key} onSelect={handleSelect} currentDate={currentDate} activeDate={sheetDate} />
          )
        })}
      </Sheets>

      {selectedDate &&
        <div className={"o-diary__activity-sheet"}>
          <ActivityManager manager={manager} groups={groups} date={selectedDate} currentDate={currentDate} onClose={() => {
            selectedDateSet(null)
          }} />
        </div>
      }

    </article>
  )
}