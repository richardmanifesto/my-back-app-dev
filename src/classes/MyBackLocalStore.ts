import {ErrorResponse} from "./ErrorResponse"
import {ActivityRecord, ActivityRecordValues} from "../types/ActivityRecord"

/**
 * MyBackLocalStore.
 */
export class MyBackLocalStore {

  /**
   * The DB object
   *
   * @var {IDBDatabase}
   */
  db: IDBDatabase

  /**
   * The DB name
   *
   * @var {string}
   */
  dbName: "myBackStore"

  /**
   * The DB version
   *
   * @var {number}
   */
  dbVersion: 1

  /**
   * Initialise the local DB
   *
   * @return {Promise<void>}
   */
  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      let openRequest = indexedDB.open(this.dbName, this.dbVersion)

      openRequest.onerror = () => {
        reject(
          ErrorResponse.generateErrorResponse(
            "unexpectedError",
            "MyBackLocalStore",
            openRequest.error.message
          )
        )
      }

      openRequest.onsuccess = () => {
        this.db = openRequest.result
        resolve()
      }

      openRequest.onupgradeneeded = (event) => {
        this.db = openRequest.result

        this.db.onerror = (event) => {
          console.error(event)

          reject(
            ErrorResponse.generateErrorResponse(
              "unexpectedError",
              "MyBackLocalStore",
              "DB error"
            )
          )
        }

        this.db.createObjectStore("activity", { keyPath: "activity_date"})
      }
    })
  }

  /**
   * Get the activity for the given date.
   *
   * @param {Date} date
   *   The date to get the activity for
   *
   * @return {Promise<ActivityRecord>}
   */
  getActivityForDate(date: Date): Promise<ActivityRecord> {
    return new Promise((resolve) => {
      const transaction = this.db.transaction("activity", "readonly").objectStore("activity")

      const request = transaction.get(date.toISOString())

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result)
        }
        else {
          resolve({
            activity_date  : date.toISOString(),
            activity_values: {}
          })
        }

      }

      request.onerror = (event ) => {
        console.error(request.error)

        resolve({
          activity_date  : date.toISOString(),
          activity_values: {}
        })
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
   * @param {boolean} hasStoredRemote
   *   A boolean indicating if the record has been pushed remotely.
   *
   * @return {Promise<void>}
   */
  putActivityForDate(date: Date, values: ActivityRecordValues, hasStoredRemote = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.db.transaction("activity", "readwrite").objectStore("activity")

      const request = store.put({
        activity_date  : date.toISOString(),
        activity_values: values,
        hasStoredRemote: hasStoredRemote
      })

      request.onsuccess = () => { // (4)
        resolve()
      }

      request.onerror = () => {
        reject(ErrorResponse.generateErrorResponse(
          "unexpectedError",
          "MyBackLocalStore",
          request.error.message
        ))
      }
    })
  }

  /**
   * Create an initialised instance of the local store.
   */
  public static create(): Promise<MyBackLocalStore> {
    return new Promise((resolve, reject) => {
      const localStore = new MyBackLocalStore()

      localStore.init()
        .then(() => resolve(localStore))
        .catch(error => reject(error))
    })
  }
}