import React, {useEffect, useState} from "react"
import {Filters} from "@root/src/types/Filters"

/**
 * VideoExplorerSidebarArgs.
 */
export type VideoExplorerSidebarArgs = {
  filterOptions  : Array<string>
  isOpen         : boolean
  onClose        : () => void
  onFiltersChange: (arg: Filters) => void
}

/**
 * VideoExplorerSidebar.
 *
 * @param {Array<string>} filterOptions
 *   An array of filter options.
 * @param {boolean} isOpen
 *   A boolean indicating of the filters are open
 * @param {() => void} onClose
 *   A callback for when the filters are closed.
 * @param {(arg: Filters) => void} onFiltersChange
 *   A callback for when the filters have changed.
 *
 * @constructor
 */
export const VideoExplorerSidebar = ({filterOptions = [], isOpen = false, onClose, onFiltersChange}: VideoExplorerSidebarArgs) => {
  const [currentFilters, currentFiltersSet] = useState<Filters>({
    filters: [],
    search : ""
  })

  const handleSearchChange = (event) => {
    currentFiltersSet({
      filters: currentFilters.filters,
      search : event.target.value
    })
  }

  const handleFilterChange = (event) => {
    const selectedFilters = currentFilters.filters
    const index = selectedFilters.indexOf(event.target.value)

    if (event.target.checked && index === -1) {
      selectedFilters.push(event.target.value)
    }
    else if (!event.target.checked && index !== -1) {
      selectedFilters.splice(index, 1)
    }

    currentFiltersSet({
      filters: currentFilters.filters,
      search : ""
    })
  }

  useEffect(() => {
    onFiltersChange(currentFilters)
  }, [JSON.stringify(currentFilters)])

  return (
    <section className={"m-video-explorer-sidebar"} data-state-open={isOpen}>
      <div className={"m-video-explorer-sidebar__inner"}>
        <div className={"m-video-explorer-sidebar__close"}>
          <button onClick={onClose}>Close</button>
        </div>

        <div className={"m-video-explorer-sidebar__search"}>
          <label htmlFor={"video-search"}>Search</label>

          <div className={"m-video-explorer-sidebar__search-input-wrap"}>
            <input onChange={handleSearchChange} id={"video-search"} placeholder={"search"} value={currentFilters.search}/>
          </div>
        </div>

        <div className={"m-video-explorer-sidebar__filters"}>
          <div className={"m-video-explorer-sidebar__filters-title"}>
            <h4>Filters</h4>
          </div>

          <ul>
            {filterOptions.map((filter, key) => {
              return (
                <li key={key}>
                  <div className={"m-video-explorer-sidebar__checkbox-wrap"}>
                    <input onChange={handleFilterChange} checked={currentFilters.filters.includes(filter)} id={`filter-${key}`} type={"checkbox"} value={filter}/>
                    <label htmlFor={`filter-${key}`}>{filter}</label>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}