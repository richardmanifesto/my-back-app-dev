import React, {ReactNode} from "react"

/**
 * Render the FormField Element.
 *
 * @returns {JSX.Element}
 *   The FormField element.
 *
 * @constructor
 */
export const FormRow = ({ children }: { children?: ReactNode, key?: string | number }) => {
  return (
    <div className={"m-form-row"}>
      {children}
    </div>
  )
}