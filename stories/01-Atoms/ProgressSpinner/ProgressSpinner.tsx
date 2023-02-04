import React from "react"

/**
 * Primary UI component for user interaction
 */
export const ProgressSpinner = ({ message }: { message: string }) => {
  return (
    <div className={"c-progress-spinner"}>
      <div className="c-progress-spinner__spinner">
        <div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
      </div>

      {message ? <div className={"c-progress-spinner__message"}>{message}</div> : null}
    </div>
  )
}