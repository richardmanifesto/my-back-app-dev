import React, {useEffect, useState} from "react"
import {Browser} from "../..//Utility/Browser";

export type InstallScreenArgs = {
  onNext: Function
}

/**
 *
 * @constructor
 */
export const InstallScreen = ({onNext}: InstallScreenArgs) => {
  const [deferredPrompt, deferredPromptSet] = useState(null)
  const [fallback, fallbackSet]             = useState(null)
  const [iosModal, iosModalSet]             = useState(false)

  const handlerBeforeInstallPrompt = (e) => {
    console.log("handlerBeforeInstallPrompt", handlerBeforeInstallPrompt)
    deferredPromptSet(e);
  }

  const handleAppInstalled = () => {
    console.log("handleAppInstalled")
    window.location.href = "/"
  }

  const handlerClick = async (event) => {
    console.log("handlerClick", deferredPrompt)

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      deferredPromptSet(null)
    }
    else if (fallback === 'ios') {
      iosModalSet(true)
    }
  }

  useEffect(() => {
    if ('serviceWorker' in navigator && !window.isStorybook) {
      navigator.serviceWorker
        .register('/mba-service-worker.js')
        .then(() => { console.log('Service Worker Registered') })
        .catch((error) =>  console.error("SE err", error))
    }

    if (Browser.navigatorIsiOs()){
      fallbackSet('ios')
    }
    else {
      window.addEventListener('beforeinstallprompt', handlerBeforeInstallPrompt)
      window.addEventListener('appinstalled', handleAppInstalled)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handlerBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return (
    <div className={"m-install-screen"}>
      <div className={"m-install-screen__inner"}>

        <div className={"m-install-screen__title"}>
          <h2>Install the app to make things easier</h2>
        </div>

        <div className={"m-install-screen__description"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquam, sem at sodales pharetra, enim ex
          porttitor purus, a lacinia ligula magna ut urna. Fusce nisl turpis, consectetur euismod mauris id,
          cursus auctor massa. Aenean commodo pharetra purus in tempor.
        </div>

        <div className={"m-install-screen__action-primary"}>
          <button onClick={handlerClick}>Install</button>
        </div>

        <div className={"m-install-screen__action-secondary"}>
          <button onClick={() => onNext({})}>Skip for now</button>
        </div>

        {iosModal &&
          <section className="m-install-screen__ios">
            <div className="m-install-screen__ios-close">
              <button onClick={() => iosModalSet(false)}>Close</button>
            </div>

            <div className="m-install-screen__ios-inner">
              <div className="m-install-screen__ios-title">
                <h4>How to add to home screen apple devices</h4>
              </div>

              <div className="m-install-screen__ios-step-share">
                <h5>Scroll</h5>
                <p>To see the iOS toolbar at bottom of your screen and tap this icon to open the menu</p>
              </div>

              <div className="m-install-screen__ios-step-add">
                <h5>Add</h5>
                <p>Now press this icon to add the app to your phone’s homescreen</p>
              </div>
            </div>
          </section>
        }
      </div>

    </div>
  )
}