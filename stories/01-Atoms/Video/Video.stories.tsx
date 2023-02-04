import React, {useEffect, useMemo, useState} from "react"

import {Video}         from "./Video"
import {youtubeLoad}   from "../../Utility/Youtube"
import {ExampleVideos} from "../../Data/Videos"


export default {
  title    : "1-Atoms/Video",
  component: Video,
  parameters: {
    layout: 'fullscreen'
  }
}

const Template = ({description, id, title, videoId}) => {
  const [ytReady, ytReadySet] = useState(false)
  const [externalStop, externalStopSet] = useState("")

  useEffect(() => {
    youtubeLoad(() => ytReadySet(true))
  }, [])

  const handleDoExternalStop = () => {
    externalStopSet(`${Date.now()}_stop`)
  }

  return (
    <div>
      <Video description={description} externalStop={externalStop} id={id} onStateChange={handleDoExternalStop} title={title} ytIsReady={ytReady} videoId={videoId} />
    </div>
  )
}

const TemplateWithScroll = ({description, id, title, videoId}) => {
  const [ytReady, ytReadySet] = useState(false)
  const [externalStop, externalStopSet] = useState("")

  useEffect(() => {
    youtubeLoad(() => ytReadySet(true))
  }, [])

  const handleDoExternalStop = () => {
    externalStopSet(`${Date.now()}_stop`)
  }

  return (
    <div>
      <div style={{height: '150vh'}}>Scroll to see the video</div>
      <Video description={description} externalStop={externalStop} id={id} onStateChange={handleDoExternalStop} title={title} ytIsReady={ytReady} videoId={videoId} />
      <div style={{height: '150vh'}}></div>
    </div>
  )
}

const TemplateWithMultipleVideos = () => {
  const [ytReady, ytReadySet] = useState(false)
  const [externalStop, externalStopSet] = useState("")

  useEffect(() => {
    youtubeLoad(() => ytReadySet(true))
  }, [])

  const handleDoExternalStop = (videoId: string) => {
    externalStopSet(`${videoId}_stop`)
  }

  const videos = useMemo(() => {
    const videos = []

    for (let i = 0; i < 5; i++) {
      videos.push(ExampleVideos[i])
    }

    return videos
  }, [])

  return (
    <div>
      <ul>
        {videos.map((video, key) => {
          return (
            <li key={key} style={{marginBottom: "2em", paddingBottom: "2em"}}>
              <Video
                description={video.description}
                externalStop={externalStop}
                id={`${key}`}
                onStateChange={handleDoExternalStop}
                title={video.title}
                ytIsReady={ytReady}
                videoId={video.videoId}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const VideoExample = Template.bind({})
VideoExample.args = {
  id         : "test",
  videoId    : ExampleVideos[0].videoId,
  title      : ExampleVideos[0].title,
  description: ExampleVideos[0].description
}

export const VideoIntersectionExample = TemplateWithScroll.bind({})
VideoIntersectionExample.args = {
  id         : "test",
  videoId    : ExampleVideos[0].videoId,
  title      : ExampleVideos[0].title,
  description: ExampleVideos[0].description
}

export const MultipleVideoExample = TemplateWithMultipleVideos.bind({})
