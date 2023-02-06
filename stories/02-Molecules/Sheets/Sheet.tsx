import React, {PropsWithChildren, ReactNode, useEffect, useRef, useState} from "react"

/**
 * SheetArgs
 */
export type SheetArgs = {
  children    : Array<ReactNode>
  shouldRemove: boolean
  onItemRemove: () => void
}

/**
 * Sheet.
 *
 * @param {PropsWithChildren} props
 *   The element props
 *
 * @param {Array<ReactNode>} children
 *   The component's children.
 * @param {boolean} shouldRemove
 *   A boolean indicating if the sheet should be removed. Used to trigger the transition.
 * @param {() => void} onItemRemove
 *   Callback function for when the sheet has successfully transitioned offscreen.
 *
 * @constructor
 */
export const Sheet = ({children, shouldRemove, onItemRemove }: PropsWithChildren<SheetArgs>) => {
  const [isActive, isActiveSet] = useState(false)
  const ref = useRef(null)

  const onTransitionEnd = () => {
    onItemRemove()
  }

  useEffect(() => {
    isActiveSet(true)
  }, [])

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('transitionend', onTransitionEnd)

      return () => {
        if (ref.current) {
          ref.current.removeEventListener('transitionend', onTransitionEnd)
        }
      }
    }
  })

  useEffect(() => {
    if (shouldRemove) {
      isActiveSet(false)
    }
  }, [shouldRemove])

  return (
    <div ref={ref} className="m-sheets__sheet" data-is-active={isActive}>
      <div className="m-sheets__sheet-inner">{children}</div>
    </div>
  )
}
