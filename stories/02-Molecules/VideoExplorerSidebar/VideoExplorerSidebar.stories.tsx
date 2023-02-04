import React, {useState} from "react"

import {VideoExplorerSidebar} from "./VideoExplorerSidebar"
import {Filters} from "@root/src/types/Filters"

export default {
  title    : "02-Molecules/VideoExplorerSidebar",
  component: VideoExplorerSidebar,
  parameters: {
    layout: 'fullscreen',
  }
}

const Template = ({filterOptions}) => {
  const [isOpen, isOpenSet] = useState(false)

  const handlerFilterChange = (newFilters: Filters) => {
    console.log("newFilters", newFilters)
  }

  const handlerClose = () => {
    isOpenSet(false)
  }

  return (
    <div>
      <VideoExplorerSidebar isOpen={isOpen} filterOptions={filterOptions} onFiltersChange={handlerFilterChange} onClose={handlerClose} />
      <button style={{
        position: "absolute",
        left    : "50%",
        top     : "50%"
      }} onClick={() => isOpenSet(true)}>Open</button>
    </div>
  )
}

export const VideoExplorerSidebarExample = Template.bind({})
VideoExplorerSidebarExample.args = {
  filterOptions: [
    "Single",
    "Paul McCartney",
    "Ringo",
    "Interview",
    "John Lennon",
    "Get back"
  ]
}
