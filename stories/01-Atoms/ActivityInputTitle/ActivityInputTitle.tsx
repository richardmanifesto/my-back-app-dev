import React from "react"

/**
 * ActivityInputTitleArgs.
 */
export type ActivityInputTitleArgs = {
  activityType: string
  label       : string
}

/**
 * ActivityInputTitle.
 *
 * @param {string} activityType
 *   The activity type
 * @param {string} label
 *   The activity label
 *
 * @constructor
 */
export const ActivityInputTitle = ({activityType, label}: ActivityInputTitleArgs) => {
  return (
    <div className="m-activity-input-title" data-activity-type={activityType}>
      <span></span>
      <h3>{label}</h3>
    </div>

  )
}