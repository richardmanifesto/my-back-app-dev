import React from "react"

/**
 * ActivityIconArgs.
 */
export type ActivityIconArgs = {
  label : string
  suffix: string
  type  : string
  value : string
}

/**
 * ActivityIcon.
 *
 * @param {string} label
 *   The activity label.
 * @param {string} suffix
 *   The activity suffix (hrs, km, etc)
 * @param {string} type
 *   The activity tye.
 * @param {string} value
 *   The activity value.
 * @constructor
 */
export const ActivityIcon = ({label, suffix, type, value}: ActivityIconArgs) => {
  return (
    <div className={"a-activity-icon"} data-icon-type={type}>
      <div className={"a-activity-icon__icon"}></div>
      <div className={"a-activity-icon__label"}>{label}</div>
      <div className={"a-activity-icon__value"}>{value}{suffix}</div>
    </div>
  )
}