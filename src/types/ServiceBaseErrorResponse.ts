import {ErrorType} from "../classes/ErrorResponse"

export type ServiceBaseErrorResponse = {
  label: string,
  type : ErrorType
}