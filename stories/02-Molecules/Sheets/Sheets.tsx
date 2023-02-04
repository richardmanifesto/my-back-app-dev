import React, {useEffect, useState, forwardRef, useImperativeHandle, ReactNode} from "react"
import {Sheet, SheetArgs} from "./Sheet"

type SheetsArgs = {
  children    : Array<ReactNode>
  onItemRemove: () => void
}

/**
 * Sheets.
 *
 * @constructor
 */
export const Sheets = forwardRef(({children = [], onItemRemove}: SheetsArgs, ref) => {
  const [isRemoving, isRemovingSet] = useState(false)
  const [initialised, initialisedSet] = useState(false)

  const windowSize = 5

  let i = children.length > windowSize ? children.length - windowSize : 0

  const items = []

  for (i; i < children.length; i++) {
    if (children[i]) {
      items.push({
        key         : i,
        item        : children[i],
        shouldRemove: (i === (children.length -1)) ? isRemoving : false
      })
    }
  }

  useImperativeHandle(ref, () => {
    return {
      removeLast() {
        isRemovingSet(true)
      }
    }
  }, [])

  useEffect(() => {
    initialisedSet(true)
  }, [])

  useEffect(() => {
    if (!isRemoving && initialised) {
      onItemRemove()
    }

  }, [isRemoving])

  const childOnRemove = () => {
    isRemovingSet(false)
  }

  return (
    <div className="m-sheets">
      {items.map((item) => {
        return (<Sheet key={item.key} shouldRemove={item.shouldRemove} onItemRemove={childOnRemove} >{item.item}</Sheet>)
      })}
    </div>
  )
})