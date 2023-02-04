import React, {useMemo, useState} from "react"

import {VideoItem} from "@root/src/types/VideoItem"
import {Video} from "../../01-Atoms/Video/Video";
import {VideoExplorerSidebar} from "../../02-Molecules/VideoExplorerSidebar/VideoExplorerSidebar";
import {Filters} from "@root/src/types/Filters"

export type VideoExplorerArgs = {
  videos : Array<VideoItem>
  ytReady: boolean
}

const pageSize = 3

export const VideoExplorer = ({videos, ytReady}: VideoExplorerArgs) => {
  const [currentPage, currentPageSet] = useState(0)
  const [sidebarIsOpen, sidebarIsOpenSet] = useState(false)
  const [selectedFilters, selectedFiltersSet] = useState([])
  const [externalStop, externalStopSet] = useState("")

  const handleDoExternalStop = () => {
    externalStopSet(`${Date.now()}_stop`)
  }

  const handlePageChange = (nexPage: number) => {
    window.scrollTo(0, 0)
    currentPageSet(nexPage)
  }

  const handlerFiltersChange = (newFilters: Filters) => {
    selectedFiltersSet([...newFilters.filters])
  }

  const handlerSidebarToggle = () => {
    sidebarIsOpenSet(!sidebarIsOpen)
  }

  const videoHasCategories = (video: VideoItem) => {
    if (!selectedFilters.length) {
      return true
    }

    for (let i = 0; i < selectedFilters.length; i++) {
      if (video.categories.includes(selectedFilters[i])) {
        return true
      }
    }

    return false
  }

  const availableFilters = useMemo(() => {
    return videos.reduce((filters, video) => {
      video.categories.forEach(category => {
        if (!filters.includes(category)) {
          filters.push(category)
        }
      })

      return filters
    }, [])
  }, [])

  const availableVideos = useMemo(() => {
    return videos.filter(video => videoHasCategories(video))

  }, [JSON.stringify(selectedFilters)])


  const [videoPage, hasMore] = useMemo(() => {
    const offset = pageSize * currentPage
    const limit  = (offset + pageSize) < availableVideos.length ? offset + pageSize : availableVideos.length

    const videoPage = []

    for (let i = offset; i < limit; i++) {
      videoPage.push(availableVideos[i])
    }

    return [videoPage, availableVideos.length !== limit]
  }, [currentPage, JSON.stringify(selectedFilters)])


  if (ytReady) {
    console.log("App ytReady")
  }

  console.log(availableFilters)

  return (
    <div className={"o-video-explorer"}>

      <div className={"o-video-explorer__toolbar"}>
        <div className={"o-video-explorer__toolbar__inner"}>
          <button onClick={handlerSidebarToggle}>{sidebarIsOpen ? "close" : "open"}</button>
        </div>
      </div>

      <ul className={"o-video-explorer__list"}>
        {videoPage.map((video: VideoItem, key) => {
          return (
            <li key={key}>
              <Video
                key={video.videoId}
                description={video.description}
                externalStop={externalStop}
                id={`${currentPage}-${key}`}
                onStateChange={handleDoExternalStop}
                title={video.title}
                videoId={video.videoId}
                ytIsReady={ytReady}
              />
            </li>
          )
        })}
      </ul>

      <div className={"o-video-explorer__pagination"}>
        <ul className={"o-video-explorer__pagination-list"}>
          {(currentPage !== 0) && <li><button data-type={"previous"} onClick={() => handlePageChange(currentPage - 1)}>Prev</button></li>}
          {hasMore && <li><button data-type={"next"} onClick={() => handlePageChange(currentPage + 1)}>Next</button></li>}
        </ul>
      </div>


      <VideoExplorerSidebar filterOptions={availableFilters} onFiltersChange={handlerFiltersChange} isOpen={sidebarIsOpen} onClose={handlerSidebarToggle} />
    </div>
  )
}