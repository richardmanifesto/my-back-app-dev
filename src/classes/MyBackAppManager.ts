import {MyBackApi}        from "./MyBackApi"
import {MyBackLocalStore} from "./MyBackLocalStore"
import {ErrorResponse}    from "./ErrorResponse"
import {ActivityRecord, ActivityRecordValues} from "../types/ActivityRecord"

/**
 * MyBackAppManager.
 */
export class MyBackAppManager {
  api       : MyBackApi
  localStore: MyBackLocalStore

  /**
   * @param {MyBackApi} api
   *   An instantiated MyBackApi object
   * @param {MyBackLocalStore} localStore
   *   An instantiated MyBackLocalStore object
   */
  constructor(api: MyBackApi, localStore: MyBackLocalStore) {
    this.api        = api
    this.localStore = localStore
  }

  /**
   * Get the activity for the given date.
   *
   * @param {Date} date
   *   The date to retrieve the activity for.
   */
  localStoreGetActivityForDate(date: Date): Promise<ActivityRecord> {
    return this.localStore.getActivityForDate(this.dateGetDateAtMidnight(date))
  }

  /**
   * Get the activity for the given date.
   *
   * @param {Date} date
   *   The date to retrieve the activity for.
   */
  meActivityGetForDate(date: Date): Promise<ActivityRecord> {
    return new Promise(async (resolve, reject) => {
      const dateAtMidnight = this.dateGetDateAtMidnight(date)

      try {
        const storedDate = await this.localStore.getActivityForDate(dateAtMidnight)

        if (Object.keys(storedDate.activity_values).length) {
          resolve(storedDate)
        }
        else {
          const remoteData = await this.api.meActivityGetForDate(dateAtMidnight)
          resolve(remoteData)
        }
      }
      catch (error: any) {
        reject(MyBackAppManager.generateError(error))
      }
    })
  }

  /**
   * Put the activity for a given date,
   *
   * @param {Date} date
   *   The date to set the activity for.
   * @param {ActivityRecordValues} values
   *   The values to set
   *
   * @return {Promise<boolean>}
   */
  meActivitySaveForDate(date: Date, values: ActivityRecordValues): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const dateAtMidnight = this.dateGetDateAtMidnight(date)
      let didSave = false

      try {
        await this.api.meActivitySaveForDate(dateAtMidnight, values)
        didSave = true
      }
      catch (error: any) {
        console.error("Api save error", error)
      }

      try {
        await this.localStore.putActivityForDate(dateAtMidnight, values, didSave)
        resolve(didSave)
      }
      catch (error: any) {
        reject(MyBackAppManager.generateError(error))
      }
    })
  }

  /**
   * Get the date at midnight.
   *
   * @param {Date} date
   *   The date to set.
   */
  dateGetDateAtMidnight = (date: Date) => {
    const clonedDate = new Date(date.toISOString())
    clonedDate.setHours(0, 0, 0, 0)
    return clonedDate
  }

  /**
   * Generate an AppError
   *
   * @param {any} error
   *   The error returned by the API call.
   * @private
   */
  private static generateError(error: any) {
    if (error instanceof ErrorResponse) {
      return error
    }
    else {
      return ErrorResponse.generateErrorResponse("unexpectedError", "MyBackAppManager", error.manager)
    }
  }
}