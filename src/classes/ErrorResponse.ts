/**
 * The possible error types.
 */
const errorTypes = [
  {
    id  : "notFound",
    code: 404
  },
  {
    id  : "malformedRequest",
    code: 400
  },
  {
    id  : "constraintError",
    code: 409
  },
  {
    id  : "unexpectedError",
    code: 500
  },
  {
    id  : "unauthorised",
    code: 403
  }
] as const

/**
 * ErrorType type.
 */
export type ErrorType = typeof errorTypes[number]["id"]

/**
 * ErrorResponse class.
 */
export class ErrorResponse {

  origin : string
  type   : ErrorType
  message: string
  data?  : string

  constructor(type: ErrorType, origin: string, message: string, data?: string) {
    this.type    = type
    this.origin  = origin
    this.message = message

    if (data) {
      this.data = data
    }
  }

  /**
   * Get the response string
   */
  responseStringGet(): string {
    return JSON.stringify({
      message: this.message,
      data   : this.data
    })
  }

  /**
   * Get the response code.
   */
  responseCodeGet(): number {
    return errorTypes.reduce((responseCode: number, current) => {
      return current.id === this.type ? current.code : responseCode
    }, 500)
  }

  /**
   * Generate an error object with the given data.
   *
   * @param {string} type
   *   The type of error
   * @param {string} origin
   *   The origin of the error
   * @param {string} message
   *   The error message
   * @param {origin} data
   *   Any additional data.
   *
   * @return {ErrorResponse}
   */
  static generateErrorResponse = (type: ErrorType, origin: string, message: string, data?: string): ErrorResponse => {
    return new ErrorResponse(type, origin, message, data)
  }
}