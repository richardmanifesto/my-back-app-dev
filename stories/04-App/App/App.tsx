import React, {useEffect, useState} from "react"
import {HomeScreen} from "../../03-Organisms/HomeScreen/HomeScreen";
import {ActivityManagerGroupArgs} from "../../02-Molecules/ActivityManagerGroup/ActivityManagerGroup";
import {Diary} from "../../03-Organisms/Diary/Diary";
import {VideoExplorer} from "../../03-Organisms/VideoExplorer/VideoExplorer";
import {VideoItem} from "@root/src/types/VideoItem";
import {youtubeLoad} from "../../Utility/Youtube";

import {BottomBar} from "../../02-Molecules/BottomBar/BottomBar"
import {MyBackLocalStore} from "@root/src/classes/MyBackLocalStore"
import {MyBackAppManager} from "@root/src/classes/MyBackAppManager"
import {MyBackApi}        from "@root/src/classes/MyBackApi"
import {AccountSidebar} from "../../02-Molecules/AccountSidebar/AccountSidebar";

export type AppArgs = {
  baseUrl           : string
  groups            : Array<ActivityManagerGroupArgs>
  currentDate       : Date
  welcomeMessage    : string
  videos            : Array<VideoItem>
}

export const App = ({baseUrl, currentDate, groups, welcomeMessage, videos}: AppArgs) => {
  const [currentTab, currentTabSet]   = useState("home")
  const [sideBarOpen, sideBarOpenSet] = useState(false)
  const [manager, managerSet] = useState<MyBackAppManager>(null)
  const [ytReady, ytReadySet] = useState<boolean>(false)

  useEffect(() => {
    youtubeLoad(() => ytReadySet(true))

    MyBackLocalStore.create()
      .then(localStore => {
        managerSet(new MyBackAppManager(new MyBackApi(baseUrl), localStore))
      })
      .catch(error => console.error(error))

  }, [])

  const handleTabChange = (selectedTab: string) => {
    if (selectedTab === 'account') {
      sideBarOpenSet(!sideBarOpen)
    }
    else {
      currentTabSet(selectedTab)
    }
  }

  const renderCurrentTab = () => {
    if (currentTab === "home") {
     return (
       <HomeScreen manager={manager} groups={groups} currentDate={currentDate} welcomeMessage={welcomeMessage} />
     )
    }
    else if (currentTab === "diary") {
      return (
        <Diary currentDate={currentDate} groups={groups} manager={manager} />
      )
    }
    else if (currentTab === "exercise") {
      if (ytReady) {
        console.log("App ytReady")
      }

      return (
        <VideoExplorer videos={videos} ytReady={ytReady} />
      )
    }
    else {
      return <div>Coming soon</div>
    }
  }

  return(
    <div className={"t-app"}>
      {renderCurrentTab()}
      <AccountSidebar isOpen={sideBarOpen} onClose={() => sideBarOpenSet(false)} />
      <BottomBar onTabSelected={handleTabChange} />
    </div>
  )
}