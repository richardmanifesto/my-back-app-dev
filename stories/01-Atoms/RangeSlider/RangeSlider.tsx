import React, {useEffect, useState, useRef} from "react"
import {ActivityInputBoundingValue} from "@root/src/types/ActivityInputArgs"

/**
 * RangeSliderArgs.
 */
export type RangeSliderArgs = {
  max         : ActivityInputBoundingValue
  min         : ActivityInputBoundingValue
  increment?  : number
  onChange    : Function
  value?      : number
}

/**
 * RangeSlider component.
 *
 * @param {ActivityInputBoundingValue} max
 *   The max bounds
 * @param {ActivityInputBoundingValue} min
 *   The min slider bounds
 * @param {Function} onChange
 *   On change callback
 * @param {number} value
 *   The slider value
 * @param {number} increment
 *   The slider increment
 * @constructor
 */
export const RangeSlider = ({max, min, onChange, value = 0, increment = 1} : RangeSliderArgs) => {
  const [currentStep, currentStepSet] = useState(value)
  const [initialised, initialisedSet] = useState(false)
  const [noSteps]                     = useState(max.value - min.value)
  const [percentagePerStep]           = useState(100 /(max.value - min.value))
  const thumb = useRef(null)

  /**
   * Get the nearest step.
   *
   * @param {number} percentageLeft
   *   The percentage from the left.
   */
  const getNearestStep = (percentageLeft) => {
    return Math.round(percentageLeft / percentagePerStep)
  }

  /**
   * Handle the key down event.
   *
   * @param {Event} keyDownEvent
   *   The triggered event
   */
  const handlerKeyDown = keyDownEvent => {
    let nextStep = currentStep

    if (keyDownEvent.code === "ArrowRight" || keyDownEvent.code === "ArrowUp") {
       nextStep = currentStep + 1 > noSteps ? noSteps : currentStep + 1
    }
    else if (keyDownEvent.code === "ArrowLeft" || keyDownEvent.code === "ArrowDown") {
      nextStep = currentStep - 1 < 0 ? 0 : currentStep - 1
    }

    if (nextStep !== currentStep) {
      currentStepSet(nextStep)
    }
  }

  /**
   * Handle the thumb mouse down event.
   *
   * @param {Event} downEvent
   *   The triggered event
   */
  const handlerThumbMouseDown = downEvent => {
    downEvent.preventDefault()

    const handlerThumbMouseDragging = dragEvent => {
      const parentBounds = thumb.current.parentNode.getBoundingClientRect()
      let position           = Math.round(((dragEvent.x - parentBounds.x) / parentBounds.width) * 100)
      position = position < 0 ? 0 : position > 100 ? 100 : position
      const newStep = getNearestStep(position)

      if (newStep !== currentStep) {
        currentStepSet(newStep)
      }
    }

    const handlerThumbMouseUp = () => {
      document.removeEventListener('pointermove', handlerThumbMouseDragging)
      document.removeEventListener('pointerup', handlerThumbMouseUp)
    }

    document.addEventListener('pointermove', handlerThumbMouseDragging)
    document.addEventListener('pointerup', handlerThumbMouseUp)
  }

  useEffect(() => {
    initialisedSet(true)
  }, [])

  useEffect(() => {
    if (initialised) {
      onChange(currentStep * increment)
    }

  }, [currentStep])

  return (
    <div className={"a-range-slider"}>
      <div className={"a-range-slider__rail"}>
        <div className={"a-range-slider__rail-inner"}>
          <div
            style={{left: `${currentStep * percentagePerStep}%`}}
            ref={thumb}
            className="a-range-slider__thumb"
            role="slider"
            tabIndex={0}
            aria-valuemin={min.value}
            aria-valuenow={currentStep * increment}
            aria-valuemax={max.value}
            onMouseDown={handlerThumbMouseDown}
            onKeyDown={handlerKeyDown}
          >

            <div className={"a-range-slider__thumb-value"}>
              <span>{currentStep * increment}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={"a-range-slider__labels"}>
        {min.label && <div className={"a-range-slider__label-min"}>{min.label}</div>}
        {max.label && <div className={"a-range-slider__label-max"}>{max.label}</div>}
      </div>
    </div>
  )
}