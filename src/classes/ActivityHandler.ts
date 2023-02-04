import {Collection, Db, ObjectId, UpdateResult, WithId} from "mongodb"
import {BSONError} from "bson"
import {ActivityRecord, ActivityUpdateRecord} from "../types/ActivityRecord"
import {HandlerBase}   from "./HandlerBase"
import {ErrorResponse} from "./ErrorResponse"
import {NotFoundError} from "./NotFoundError"
import {DataPage}      from "../types/DataPage"
import {Filter} from "mongodb/src/mongo_types"
import webpack from "webpack";

/**
 * UserHandler class.
 */
export class ActivityHandler extends HandlerBase<ActivityRecord, ActivityUpdateRecord> {

  /**
   * The handler name.
   */
  name = "activity_handler"

  /**
   * The page size to use for paginated results.
   *
   * @type {number}
   */
  pageSize: number = 10

  constructor(itemCollection: Collection<ActivityRecord>) {
    super()
    this.itemCollection = itemCollection
  }

  /**
   * Static create function.
   *
   * @param {Db} db
   *   An instantiated DB object.
   */
  static async create(db: Db) {
    const configCollection = db.collection<ActivityRecord>("activity_record")
    return new ActivityHandler(configCollection)
  }

  /**
   * Create a new activity.
   *
   * @param {ActivityRecord} data
   *   The activity data to insert.
   *
   * @return {Promise<string>}
   *   The ID of the newly inserted record.
   */
  activityCreate(data: ActivityRecord): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemCreate(data)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Delete an activity.
   *
   * @param {string} id
   *   The ID of the activity to delete.
   *
   * @return {Promise<boolean>}
   *   A boolean indicating the activity was deleted successfully.
   */
  activityDelete(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemDelete(id)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

 /**
   * Retrieve an activity by ID.
   *
   * @param {string} id
   *   The email address of the user to retrieve.
   *
   * @return {Promise<UserRecord>}
   *   The retrieved user record.
   */
  activityGetById(id: string): Promise<ActivityRecord> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemFindById(id)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Retrieve an activity by ID.
   *
   * @param {string} id
   *   The email address of the user to retrieve.
   *
   * @return {Promise<UserRecord>}
   *   The retrieved user record.
   */
  activityGetForUserByDate(userId: string, date: string): Promise<ActivityRecord> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemFind({
          date  : date,
          userId: new ObjectId(userId)
        })
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }


  /**
   * Update an existing activity.
   *
   * @param {string} id
   *   The activity ID
   * @param {ActivityUpdateRecord} data
   *   The activity update record
   */
  activityUpdate(id: string, data: ActivityUpdateRecord) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.collectionItemUpdate(id, data)
        resolve({})
      }
      catch (error) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Create a new activity.
   *
   * @param {ActivityRecord} data
   *   The activity data to insert.
   *
   * @return {Promise<string>}
   *   The ID of the newly inserted record.
   */
  activityUpsert(data: ActivityRecord, filter: Filter<any>): Promise<UpdateResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemUpsert(data, filter)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  getPageForUser(userId: string, page: number = 0): Promise<DataPage> {
    return new Promise((resolve, reject) => {
      this.itemCollection
        .find({userId: {$eq: new ObjectId(userId)}})
        .skip(this.pageSize * page)
        .limit(this.pageSize)
        .toArray()
        .then((results: WithId<ActivityRecord>[]) => {
          const dataPage: DataPage = {
            items      : results ? results : [],
            currentPage: page
          }

          if (dataPage.items.length === this.pageSize) {
            dataPage.nextPage = page +1
          }

          resolve(dataPage)
        })
        .catch(error => {
          reject(
            this.generateError(
              HandlerBase.errorResponses.unexpectedError.type,
              HandlerBase.errorResponses.unexpectedError.label,
              JSON.stringify(error)
            )
          )
        })
    })

  }

  /**
   * Make sure all errors thrown are of the type ErrorResponse.
   *
   * @param {unknown} error
   *   The error that was thrown.
   *
   * @private
   */
  protected errorThrow (error: any): ErrorResponse {
    if (error instanceof ErrorResponse) {
      return error
    }
    else if (error instanceof BSONError ) {
      return this.generateError(
        HandlerBase.errorResponses.activityNotFound.type,
        HandlerBase.errorResponses.activityNotFound.label,
        error.message
      )
    }
    else if (error instanceof NotFoundError ) {
      return this.generateError(
        HandlerBase.errorResponses.activityNotFound.type,
        HandlerBase.errorResponses.activityNotFound.label,
        error.message
      )
    }
    else {
      return this.generateError(
        HandlerBase.errorResponses.unexpectedError.type,
        HandlerBase.errorResponses.unexpectedError.label,
        JSON.stringify(error)
      )
    }
  }
}

