import React, {MouseEventHandler} from "react"

/**
 * TopBar.
 */
type TopBar = {
  label           : string
  backCta?        : string
  backLink?       : string
  forwardCta?     : string
  forwardLink?    : string
  doBackAction?   : MouseEventHandler<HTMLButtonElement>
  doForwardAction?: MouseEventHandler<HTMLButtonElement>
}

/**
 * TopBar.
 *
 * @param {string} label
 *   The label to display in the top bar.
 * @param {string} backCta
 *   The back CTA.
 * @param {string} backLink
 *   The back link.
 * @param {string} forwardCta
 *   The forward CTA.
 * @param {string} forwardLink
 *   The forward link.
 * @param {Function} doBackAction
 *   A callback to handle the back action
 * @param {Function} doForwardAction
 *    A callback to handle the forward action
 *
 * @constructor
 */
export const TopBar = ({label, backCta, backLink, forwardCta, forwardLink, doBackAction, doForwardAction}: TopBar) => {
  return (
    <div className={'a-top-bar'}>
      <h3>{label}</h3>
      {
        backLink ? <a className={'a-top-bar__back-link'} href={backLink}>{backCta ? backCta : 'Back'}</a> :
          doBackAction ? <button className={'a-top-bar__back-link'} onClick={doBackAction}>{backCta ? backCta : 'Back'}</button> : null
      }
      {
        forwardLink ? <a className={'a-top-bar__forward-link'} href={forwardLink}>{forwardCta ? forwardCta : 'Forward'}</a> :
          doForwardAction ? <button className={'a-top-bar__forward-link'} onClick={doForwardAction}>{forwardCta ? forwardCta : 'Forward'}</button> : null
      }
    </div>
  )
}
