import React, {useEffect, useState} from "react"

import {VideoExplorer} from "./VideoExplorer"
import {ExampleVideos} from "../../Data/Videos"
import {youtubeLoad}   from "../../Utility/Youtube"

export default {
  title     : "03-Organisms/VideoExplorer",
  component : VideoExplorer,
  parameters: {
    layout: 'fullscreen'
  }
}

const Template = () => {
  const [ytReady, ytReadySet] = useState(false)

  useEffect(() => {
    youtubeLoad(() => ytReadySet(true))
  }, [])


  return (
    <VideoExplorer ytReady={ytReady} videos={ExampleVideos} />
  )
}

export const VideoExplorerExample = Template.bind({})