import axios, {Axios} from "axios"
import {ErrorResponse} from "./ErrorResponse"
import {ActivityRecord, ActivityRecordValues} from "../types/ActivityRecord"

/**
 * MyBackApi
 */
export class MyBackApi {

  /**
   * An instantiated Api object.
   *
   * @type {Axios}
   */
  api: Axios

  /**
   * @param {string} baseUrl
   *   The base url for the API
   */
  constructor(baseUrl: string) {
    this.api = axios.create({
      baseURL: baseUrl
    })
  }

  /**
   * Save the activity for the given date.
   *
   * @param {Date} date
   *   The date to retrieve the activity for.
   * @param {ActivityRecordValues} values
   *   The values to save
   *
   * @return {Promise<void>}
   */
  meActivitySaveForDate(date: Date, values: ActivityRecordValues): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.post(`/api/me/activity/for-date/${date.toISOString()}`, {values: values})
        .then(() => resolve())
        .catch(error => reject(MyBackApi.generateError(error)))
    })
  }

  /**
   * Retrieve the activity for the given date.
   *
   * @param {Date} date
   *   The date to retrieve the activity for.
   *
   * @return {Promise<ActivityRecord>}
   */
  meActivityGetForDate(date: Date): Promise<ActivityRecord> {
    return new Promise((resolve, reject) => {
      this.api.get(`/api/me/activity/for-date/${date.toISOString()}`)
        .then(response => resolve(response.data))
        .catch(error => reject(MyBackApi.generateError(error)))
    })
  }

  meUpdate = (values: {}): Promise<{sessionId: string}> => {
    return new Promise(async (resolve, reject) => {
      this.api.post(`/api/me/update`, values)
        .then(response => resolve(response.data))
        .catch(error => reject(MyBackApi.generateError(error)))
    })
  }

  meVerify = (values: {}): Promise<{sessionId: string}> => {
    return new Promise(async (resolve, reject) => {
      console.log("WHH")
      this.api.post(`/api/me/verify`, values)
        .then(response => resolve(response.data))
        .catch(error => reject(MyBackApi.generateError(error)))
    })
  }

  userLogin(emailAddress: string, password: string): Promise<{sessionId: string}> {
    return new Promise((resolve, reject) => {
      this.api.post(`/api/user/session-create`, {
        email_address: emailAddress,
        password     : password
      })
        .then(response => resolve(response.data))
        .catch(error => reject(MyBackApi.generateError(error)))
    })
  }

  userRegister = (values: {}): Promise<{verificationToken? :string}> => {
    return new Promise(async (resolve, reject) => {
      this.api.post(`/api/user/register`, values)
        .then(response => resolve(response.data))
        .catch(error => reject(MyBackApi.generateError(error)))
    })
  }

  userPasswordReset = (emailAddress: string): Promise<{verificationToken? :string}> => {
    return new Promise(async (resolve, reject) => {
      this.api.post(`/api/user/password-reset`, {email_address: emailAddress})
        .then(response => resolve(response.data))
        .catch(error => reject(MyBackApi.generateError(error)))
    })
  }



  /**
   * Generate an AppError
   *
   * @param {any} error
   *   The error returned by the API call.
   * @private
   */
  private static generateError(error: any) {
    if (error.response.status === 404) {
      return ErrorResponse.generateErrorResponse("notFound", "MyBackApi", error.message)
    }
    else {
      const message = error.response && error.response.data && error.response.data.message ? error.response.data.message : error.message
      return ErrorResponse.generateErrorResponse("unexpectedError", "MyBackApi", message)
    }
  }
}