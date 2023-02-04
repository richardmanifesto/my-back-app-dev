import React, {useRef, useState} from "react"

import {Sheets} from "./Sheets"

export default {
  title    : "02-Molecules/Sheets",
  component: Sheets,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({}) => {
  const [items, itemsSet] = useState(["Sheet 1"])
  const ref = useRef(null)

  const addItem = () => {
    itemsSet([...items, `Sheet ${items.length + 1}`])
  }

  const removeItem = () => {
    ref.current.removeLast()
  }

  const onItemRemove = () => {
    items.pop()
    itemsSet([...items])
  }

  return (
    <div>
      <Sheets ref={ref} onItemRemove={onItemRemove}>
        {items.map(item => <div>{item}</div>)}
      </Sheets>

      <div className={"example-actions-fixed"}>
        <button onClick={addItem}>Add</button>
        <button onClick={removeItem}>Remove</button>
      </div>
    </div>
  )
}

export const SheetsExample = Template.bind({})
