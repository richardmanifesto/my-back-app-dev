export type ActivityInputValue = {
  name : string
  value: string
}

/**
 * RangeSliderBounds.
 */
export type ActivityInputBoundingValue = {
  label: string
  value: number
}

export type ActivityInputBounds = {
  max: ActivityInputBoundingValue
  min: ActivityInputBoundingValue
}

export type ActivityInputArgs = {
  label       : string
  name        : string
  bounds      : ActivityInputBounds
  increment?  : number
  placeholder? : string
  type        : "number" | "select" | "range"
  options?    : Array<{value: string, label: string}>
  onChange    : (arg0: ActivityInputValue) => void
  value       : string
}