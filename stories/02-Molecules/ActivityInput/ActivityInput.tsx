import React, {useEffect, useRef, useState} from "react"
import {ActivityInputArgs, ActivityInputBounds} from "@root/src/types/ActivityInputArgs"
import {RangeSlider}       from "../../01-Atoms/RangeSlider/RangeSlider"

/**
 * ActivityInput.
 *
 * @param {ActivityInputBounds} bounds
 *   The range slider bounds.
 * @param {string} label
 *   The input label.
 * @param {string} name
 *   The input name
 * @param {number} increment
 *   The slider increment.
 * @param {Array<{value: string, label: string}>} options
 *   The input options
 * @param {(arg0: ActivityInputValue) => void} onChange
 *   The onchange callback.
 * @param {string} placeholder
 *   The input placeholder
 * @param {string} type
 *   The input type.
 * @param {string} value
 *   The input value.
 * @constructor
 */
export const ActivityInput = ({bounds, label, name, increment = 1, options = [], onChange, placeholder, type, value}: ActivityInputArgs) => {
  const [internalValue, internalValueSet]   = useState<string>(value)
  const [hasInitialised, hasInitialisedSet] = useState<boolean>(false)
  const debounce = useRef(null)

  /**
   * Handle the input change function.
   *
   * @param {string} inputValue
   *   The inout value.
   */
  const handleValueChange = (inputValue: string) => {
    onChange({
      name : name,
      value: inputValue
    })
  }

  /**
   * Render the number input.
   */
  const renderNumberInput = () => {
    return (
      <input
        className={"m-activity-input__input"}
        name={name}
        type={"number"}
        value={internalValue}
        placeholder={placeholder}
        onChange={event => internalValueSet(event.target.value)}
      />
    )
  }

  /**
   * Render the range input.
   */
  const renderRangeInput = () => {
    const numberValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value)

    return (
      <RangeSlider max={bounds.max} min={bounds.min} increment={increment} value={numberValue} onChange={value => internalValueSet(value)} />
    )
  }

  /**
   * Render the select input.
   */
  const renderSelectInput = () => {
    return (
      <select
        className={"m-activity-input__input"}
        name={name}
        value={internalValue}
        onChange={event => internalValueSet(event.target.value)}
      >
        {options.map((option, key) => {
          return (<option key={key} value={option.value} >{option.label}</option>)
        })}
      </select>
    )
  }

  useEffect(() => {
    if (hasInitialised) {
      if (debounce.current) {
        clearTimeout(debounce.current)
      }

      debounce.current = setTimeout(() => {
        debounce.current = null
        handleValueChange(internalValue)
      }, 200)
    }
  }, [internalValue])

  useEffect(() => hasInitialisedSet(true), [])

  return (
    <div className="m-activity-input" data-input-type={type}>
      <div className="m-activity-input__label">{label}</div>
      {type === "select" ? renderSelectInput() : type === "range" ? renderRangeInput() : renderNumberInput()}
    </div>
  )
}