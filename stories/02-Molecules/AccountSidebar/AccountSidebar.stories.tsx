import React, {useState} from "react"

import {AccountSidebar} from "./AccountSidebar"

export default {
  title    : "02-Molecules/AccountSidebar",
  component: AccountSidebar,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = () => {
  const [isOpen, isOpenSet] = useState(false)


  const handlerClose = () => {
    isOpenSet(false)
  }

  return (
    <div>
      <AccountSidebar isOpen={isOpen}  onClose={handlerClose} />
      <button style={{
        position: "absolute",
        left    : "50%",
        top     : "50%"
      }} onClick={() => isOpenSet(true)}>Open</button>
    </div>
  )
}

export const AccountSidebarExample = Template.bind({})
