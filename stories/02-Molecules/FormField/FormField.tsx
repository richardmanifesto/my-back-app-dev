import React, {useEffect, useRef, useState, ChangeEvent} from "react"
import {FieldOption} from "@root/src/types/Field"

/**
 * FormFieldArgs.
 */
type FormFieldArgs = {
  defaultValue?: string
  disabled?    : boolean
  error?       : string
  label        : string
  name         : string
  options?     : Array<FieldOption>
  handleBlur   : Function
  handleChange : Function
  required?    : boolean
  type?        : string
  value        : string
}

/**
 * FormField.
 *
 * @param {string} defaultValue
 *   The default field value.
 * @param {boolean} disabled
 *   A boolean indicating of the field is disabled.
 * @param {string} error
 *   An error message associated with the input.
 * @param {Function} handleBlur
 *   Handle the blur action
 * @param {Function} handleChange
 *    Handle the onchange action
 * @param {string} name
 *   The field name.
 * @param {string} label
 *   The field label
 * @param {Array<FieldOption>} options
 *   The field option.
 * @param {boolean} required
 *   A boolean indicating if the field is required.
 * @param {string} type
 *   The field type.
 * @param {string} value
 *   The field value.
 *
 * @constructor
 */
export const FormField = ({defaultValue, disabled = false, error = "", handleBlur, handleChange, label, name, options, required = false, type = "text", value}: FormFieldArgs) => {
  if (type === "markup") {
    return (
      <div className={"m-form-field__markup"}>
        <div dangerouslySetInnerHTML={{__html: defaultValue}} />
      </div>
    )
  }

  if (type === "submit") {
    return (
      <button type="submit">{label}</button>
    )
  }

  const [localValue, localValueSet] = useState(value)
  const debounce   = useRef(null)
  const errorState = error !== ""

  /**
   * Debounce any changes.
   *
   * @param {ChangeEvent<HTMLInputElement>} event
   *  The triggered event.
   */
  const handelLocalChange = (event: ChangeEvent<HTMLInputElement>) => {
    localValueSet(event.currentTarget.value)
  }

  useEffect(() => {
    if (debounce.current) {
      clearTimeout(debounce.current)
    }

    debounce.current = setTimeout(() => {
      debounce.current = null
      handleChange(name, localValue)
    }, 400)
  }, [localValue])

  if (type === "radios") {
    return (
      <div className={"m-form-field"} data-has-error={errorState}>
        <label htmlFor={name} className={"m-form-field__label"}>{label}</label>

        <div className={"m-form-field__options"}>
          {options.map((option, key) => {
            return (
              <div className={"m-form-field__radio-option"} key={key}>
                <input name={name} type={"radio"} id={`${name}-${key}`} onChange={handelLocalChange} onBlur={event => handleBlur(event)} value={option.value} />
                <label htmlFor={`${name}-${key}`}>{option.label}</label>
              </div>
            )
          })}
        </div>

        <div id={`${name}_error`} className={"m-form-field__error-message"}>{error}</div>
      </div>
    )
  }

  return (
    <div className={"m-form-field"} data-has-error={errorState}>
      <label htmlFor={name} className={"m-form-field__label"}>{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        onChange={handelLocalChange}
        onBlur={handelLocalChange}
        placeholder={label}
        value={localValue}
        aria-invalid={errorState}
        aria-describedby={`${name}_error`}
      />

      <div id={`${name}_error`} aria-live={"assertive"} className={"m-form-field__error-message"}>{error}</div>
    </div>
  )
}