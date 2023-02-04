import React, {useMemo} from "react"
import {datesAreTheSame} from "../../Utility/Date"

/**
 * DiarySheetArgs.
 */
export type DiarySheetArgs = {
  activeDate : Date
  currentDate: Date
  key?       : number
  onSelect   : (arg0: Date) => void
}

/**
 * DiarySheet.
 *
 * @param {Date} activeDate
 *   The active date being displayed
 * @param {Date} currentDate
 *   The current date.
 * @param {Function} onSelect
 *   On select callback.
 *
 * @constructor
 */
export const DiarySheet = ({activeDate, currentDate, onSelect}: DiarySheetArgs) => {

  // Make sure we are using a cloned version of the date just in case
  const dateIterator = new Date(activeDate.toISOString())
  dateIterator.setDate(1)

  const dates: Array<Date> = useMemo(() => {
    const dates = []
    const month = dateIterator.getMonth()

    while (dateIterator.getMonth() === month) {
      dates.push(new Date(dateIterator.toISOString()))
      dateIterator.setDate(dateIterator.getDate() + 1)
    }

    return dates
  }, [activeDate])

  return (
    <ul className={"m-diary-sheet"}>
      {dates.map((date, key) => {
        return (
          <li key={key}>
            <button onClick={() => onSelect(date)} data-is-current={datesAreTheSame(currentDate, date)}>
              {date.toLocaleDateString("en-gb", {day: "numeric"})}
            </button>
          </li>
        )
      })}
    </ul>
  )
}