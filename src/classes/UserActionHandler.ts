import {Collection, Db, ObjectId} from "mongodb"
import {BSONError} from "bson"
import {HandlerBase}   from "./HandlerBase"
import {ErrorResponse} from "./ErrorResponse"
import {UserActionRecord, UserActionRecordType} from "../types/UserActionRecord"
import {NotFoundError} from "./NotFoundError";
import {UserRecord} from "@root/src/types/UserRecord";

/**
 * UserHandler class.
 */
export class UserActionHandler extends HandlerBase<UserActionRecord, UserActionRecord> {

  /**
   * @inheritDoc.
   */
  name = "user_action_handler"

  /**
   * Object constructor.
   *
   * @param {Collection<UserActionRecord>} itemCollection
   *   The DB collection to use.
   */
  constructor(itemCollection: Collection<UserActionRecord>) {
    super()
    this.itemCollection = itemCollection
  }

  /**
   * Create factory.
   *
   * @param {Db} db
   *   An instantiated DB object.
   */
  static create(db: Db) {
    const collection = db.collection<UserActionRecord>("user_actions")
    return new UserActionHandler(collection)
  }

  /**
   * Make sure all errors thrown are of the type ErrorResponse.
   *
   * @param {unknown} error
   *   The error that was thrown.
   *
   * @private
   */
  protected errorThrow (error: unknown): ErrorResponse {
    if (error instanceof ErrorResponse) {
      return error
    }
    else if (error instanceof BSONError ) {
      return this.generateError(
        HandlerBase.errorResponses.actionNotFound.type,
        HandlerBase.errorResponses.actionNotFound.label,
        error.message
      )
    }
    else if (error instanceof NotFoundError ) {
      return this.generateError(
        HandlerBase.errorResponses.actionNotFound.type,
        HandlerBase.errorResponses.actionNotFound.label,
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

  /**
   * Create a user action.
   *
   * @param {string} userId
   *   The id of the user to create the action for.
   * @param {UserActionRecordType} actionType
   *   The action type to create.
   *
   * @return {Promise<string>}
   *   The ID of the newly inserted record.
   */
  actionCreate(userId: string, actionType: UserActionRecordType): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemCreate({
          type   : actionType,
          userId : new ObjectId(userId),
          created: (new Date()).toString(),

        })
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Delete a user.
   *
   * @param {string} id
   *   The ID of the user to delete.
   *
   * @return {Promise<boolean>}
   *   A boolean indicating the user was deleted successfully.
   */
  actionClaim(id: string): Promise<UserActionRecord> {
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
   * Delete a user.
   *
   * @param {string} id
   *   The ID of the user to delete.
   *
   * @return {Promise<boolean>}
   *   A boolean indicating the user was deleted successfully.
   */
  actionDelete(id: string): Promise<boolean> {
    return this.collectionItemDelete(id)
  }

  /**
   * Retrieve a user by ID.
   *
   * @param {string} id
   *   The email address of the user to retrieve.
   *
   * @return {Promise<UserRecord>}
   *   The retrieved user record.
   */
  actionGetById(id: string): Promise<UserActionRecord> {
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
}

