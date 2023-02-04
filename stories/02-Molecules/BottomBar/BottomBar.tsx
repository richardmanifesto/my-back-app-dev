import React from "react"

/**
 * BottomBarArgs.
 */
export type BottomBarArgs = {
  onTabSelected: (tabId: string) => void
}

/**
 * BottomBar.
 *
 * @constructor
 */
export const BottomBar = ({ onTabSelected }: BottomBarArgs) => {


  return (
    <div className={"m-bottom-bar"}>
      <ul className={"m-bottom-bar__actions"}>
        <li><button className={"m-bottom-bar__action-link"} data-icon-type={"my-day"} onClick={() => onTabSelected("home")}>My day</button></li>
        <li><button className={"m-bottom-bar__action-link"} data-icon-type={"diary"} onClick={() => onTabSelected("diary")}>Diary</button></li>
        <li><button className={"m-bottom-bar__action-link"} data-icon-type={"exercise"} onClick={() => onTabSelected("exercise")}>Exercise</button></li>
        <li><button className={"m-bottom-bar__action-link"} data-icon-type={"reports"} onClick={() => onTabSelected("reports")}>Reports</button></li>
        <li><button className={"m-bottom-bar__action-link"} data-icon-type={"account"} onClick={() => onTabSelected("account")}><span>Account</span></button></li>
      </ul>
    </div>
  )
}