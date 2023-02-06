import React from "react";

/**
 * AccountSidebarArgs.
 */
export type AccountSidebarArgs = {
  isOpen         : boolean
  onClose        : () => void
}

export const AccountSidebar = ({isOpen , onClose}: AccountSidebarArgs) => {
  return (
    <section className={"m-account-sidebar"} data-state-open={isOpen}>
      <div className={"m-account-sidebar__inner"}>
        <div className={"m-account-sidebar__close"}>
          <button onClick={onClose}>Close</button>
        </div>

        <div className={"m-account-sidebar__header"}>
          <div className={"m-account-sidebar__title"}>
            <h3>Account</h3>
          </div>
        </div>

        <div className={"m-account-sidebar__links"}>
          <ul>
            <li>
              <a href={"/user/account"}>Your account</a>
            </li>
            <li>
              <a href={"/user/logout"}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}