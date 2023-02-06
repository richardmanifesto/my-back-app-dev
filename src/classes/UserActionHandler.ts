import {HandlerBase}   from "./HandlerBase"
import {ErrorResponse} from "./ErrorResponse"
import {UserActionRecord, UserActionRecordType} from "@root/src/types/UserActionRecord"
import {NotFoundError} from "./NotFoundError";
import {UserRecord} from "@root/src/types/UserRecord";
import {DynamoDB} from "aws-sdk";

/**
 * UserHandler class.
 */
export class UserActionHandler extends HandlerBase<UserActionRecord> {

  /**
   * @inheritDoc.
   */
  name = "user_action_handler"

  /**
   * The DB table to use.
   */
  table = "user_actions"

  /**
   * Object constructor.
   *
   * @param {DynamoDB} db
   *   The DB collection to use.
   */
  constructor(db: DynamoDB) {
    super(db)
  }

  /**
   * Static create function.
   *
   * @param {DynamoDB} db
   *   An instantiated DB object.
   */
  static async create(db: DynamoDB) {
    return new UserActionHandler(db)
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

        const actionID = this.uuidCreate()

        const item: DynamoDB.PutItemInput = {
          Item                 : {
            id                 : {"S": actionID},
            userId             : {"S": userId},
            type               : {"S": actionType},
            created            : {"S": (new Date()).toISOString()}
          },
          TableName             : this.table,
          ReturnConsumedCapacity: "TOTAL"
        }

        await this.dbItemCreate(item)
        resolve(actionID)
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
   * @return {Promise<UserActionRecord>}
   *   The returned user action.
   */
  actionClaim(id: string): Promise<UserActionRecord> {
    return this.actionGetById(id)
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
    return this.dbItemDelete(id)
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
        const result = await this.dbItemFindById(id)
        resolve({
          id     : result.Item.id.S,
          userId : result.Item.userId.S,
          type   : result.Item.type.S as UserActionRecordType,
          created: result.Item.created.S,
        })
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
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
  protected errorThrow (error: unknown): ErrorResponse {
    if (error instanceof ErrorResponse) {
      return error
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
}

