export const FieldTypes = [
  "email",
  "markup",
  "password",
  "radios",
  "submit",
  "text",
]

export type FieldOption = {
  label: string
  value: string
}

export type Field = {
  name         : string
  label        : string
  type         : typeof FieldTypes[number]
  required?    : boolean
  options      : Array<FieldOption>
  equals?      : string
  value        : string
  errorMessages?: {
    [key: string]: string
  }
}