import React, {useEffect, useState} from "react"
import {ActivityInputValue} from "@root/src/types/ActivityInputArgs"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {ActivityManagerGroup, ActivityManagerGroupArgs} from "../../02-Molecules/ActivityManagerGroup/ActivityManagerGroup"
import {ProgressSpinner} from "../../01-Atoms/ProgressSpinner/ProgressSpinner"
import {dateGetFormatted, datesAreTheSame, startOfTheDay} from "../../Utility/Date"

/**
 * ActivityManagerArgs.
 */
export type ActivityManagerArgs = {
  manager    : MyBackAppManager
  groups     : Array<ActivityManagerGroupArgs>
  date       : Date
  currentDate: Date
  onClose    : (arg0?: boolean) => void
}

/**
 * ActivityManager.
 *
 * @param {Date} currentDate
 *   The current date - this is passed through as dependency to facilitate testing.
 * @param {Date} date
 *   The date for which the activity records are being managed.
 * @param {Array<ActivityManagerGroupArgs>} groups
 *   The activity groups to render out.
 * @param {MyBackAppManager} manager
 *   An instantiated MyBackAppManager object.
 * @param {Function} onClose
 *   onClose callback
 *
 * @constructor
 */
export const ActivityManager = ({ currentDate, date, groups, manager, onClose }: ActivityManagerArgs) => {
  const [values, valuesSet]     = useState(null)
  const [dateAtMidnight]        = useState(startOfTheDay(date))
  const [changed, changedSet]   = useState(false)
  const [isSaving, isSavingSet] = useState(false)

  const state = values === null ? 'loading' : isSaving ? 'saving' : 'active'

  /**
   * Handle the close action
   */
  const handleClose = () => {
    changed ? isSavingSet(true) : onClose()
  }

  /**
   * Handle a value change event.
   *
   * Used to track whether to commit an updated to the DB.
   *
   * @param {ActivityInputValue} value
   *   The updated value
   */
  const handleChange = (value: ActivityInputValue) => {
    if (!changed) {
      changedSet(true)
    }

    const update = {}
    update[value.name] = value.value
    valuesSet({...values, ...update})
  }

  useEffect(() => {
    if (manager) {
      manager.meActivityGetForDate(date)
        .then(data => valuesSet(data.values))
        .catch(error => {
          console.log(error)
          valuesSet({})
        })
    }
  }, [manager])

  useEffect(() => {
    if (isSaving) {
      manager.meActivitySaveForDate(dateAtMidnight, values)
        .then(didSave => onClose(didSave))
        .catch(() => onClose(true))
    }
  }, [isSaving])


  /**
   * Get the heading based on the dates provided.
   */
  const headingGet = () => {
    return datesAreTheSame(date, currentDate) ? "Let’s find out about your day" : dateGetFormatted(date)
  }

  return (
    <article className={"o-activity-manager"} data-state={state}>
      <div className={"o-activity-manager__inner"}>
        <div className={"o-activity-manager__close"}>
          <button onClick={handleClose}>Close</button>
        </div>

        <div className={"o-activity-manager__title"}>
          <h2>{headingGet()}</h2>
        </div>

        {values && groups.map((group, groupKey) => {
          return (
            <div key={groupKey} className={"o-activity-manager__group"}>
              <ActivityManagerGroup
                label={group.label}
                suffix={group.suffix}
                activityType={group.activityType}
                fields={group.fields}
                onChange={handleChange}
                notes={group.notes}
                values={values}
              />
            </div>
          )
        })}
      </div>

      {(state === 'loading' || state === 'saving') &&
        <ProgressSpinner message={(state === 'saving') ? "Saving" : ""} />}
    </article>
  )
}