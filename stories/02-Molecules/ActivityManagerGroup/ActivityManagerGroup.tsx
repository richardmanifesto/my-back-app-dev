import React, {useRef, useState} from "react"
import {ActivityInputArgs, ActivityInputValue} from "@root/src/types/ActivityInputArgs"
import {ActivityInputTitle} from "../../01-Atoms/ActivityInputTitle/ActivityInputTitle"
import {ActivityInput}      from "../ActivityInput/ActivityInput"

/**
 * ActivityManagerGroup component arguments.
 */
export type ActivityManagerGroupArgs = {
  label       : string
  activityType: string
  suffix      : string
  fields      : Array<ActivityInputArgs>
  onChange    : (arg0: ActivityInputValue) => void
  notes       : string
  values      : {
    [key: string]: string
  }
}

/**
 * ActivityManagerGroup.
 *
 * @param {string} activityType
 *   The activity type
 * @param {Array<ActivityInputArgs>} fields
 *   The fields to render out
 * @param {string} label
 *   The group label
 * @param {string} notes
 *   The activity type notes.
 * @param {Function} onChange
 *   The on change callback.
 * @param {{}} values
 *   The activity values
 *
 * @constructor
 */
export const ActivityManagerGroup = ({activityType, fields, label, notes, onChange, values} : ActivityManagerGroupArgs) => {
  const [notesOpen, notesOpenSet]             = useState<boolean>(false)
  const [notesInnerValue, notesInnerValueSet] = useState<string>(notes)
  const notesDebounce                         = useRef(null)

  /**
   * Handle the notes change events.
   *
   * @param {Event} notesValue
   *   The triggered event.
   */
  const handlerNotesChange = (notesValue) => {
    notesInnerValueSet(notesValue.target.value)

    if (notesDebounce.current) {
      clearTimeout(notesDebounce.current)
    }

    notesDebounce.current = setTimeout(() => {
      notesDebounce.current = null
      onChange({
        name : `${activityType}_notes`,
        value: notesValue.target.value
      })
    }, 500)
  }

  return (
    <fieldset className={"o-activity-manager-group"}>
      <div className={"o-activity-manager-group__header"}>
        <ActivityInputTitle activityType={activityType} label={label} />

        <div className={"o-activity-manager-group__notes-toggle"}>
          <button className="b-button-action-small" onClick={() => notesOpenSet(!notesOpen)}>Notes</button>
        </div>
      </div>

      {fields.map((field, fieldKey) => {
        return (
          <div key={fieldKey} className={"o-activity-manager-group__item"} data-activty-type={field.type}>
            <ActivityInput
              label={field.label}
              name={field.name}
              bounds={field.bounds}
              options={field.options}
              placeholder={field.placeholder}
              type={field.type}
              onChange={onChange}
              value={values[field.name] ? values[field.name] : "0"}
            />
          </div>
        )
      })}

      <div className="o-activity-manager-group__notes" data-is-open={notesOpen}>
        <div className="o-activity-manager-group__notes-inner">
          <textarea onChange={handlerNotesChange} value={notesInnerValue} placeholder={"Enter your notes here"}></textarea>
        </div>
      </div>
    </fieldset>
  )
}