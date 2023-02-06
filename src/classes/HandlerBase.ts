import {DynamoDB}                 from "aws-sdk"
import { v4 as uuidv4 }           from 'uuid'
import {ErrorType, ErrorResponse} from "./ErrorResponse"
import {NotFoundError}            from "./NotFoundError"
import {ServiceBaseErrorResponse} from "@root/src/types/ServiceBaseErrorResponse"

/**
 * ServiceBase class.
 *
 * Bass class for the Data Service.
 */
export class HandlerBase<TSchema extends {id?: string}> {

  /**
   * An instantiated db object.
   */
  db: DynamoDB

  /**
   * @inheritDoc
   */
  public static errorResponses: Record<string, ServiceBaseErrorResponse> = {
    actionNotFound: {
      label: "Action not found",
      type : "notFound"
    },
    activityNotFound: {
      label: "Activity not found",
      type : "notFound"
    },
    invalidToken: {
      label: "Invalid token",
      type : "unauthorised"
    },
    unexpectedError: {
      label: "An unexpected error occurred",
      type : "unexpectedError"
    },
    userExists: {
      label: "User already exists",
      type : "constraintError"
    },
    userUnauthorised: {
      label: "User unauthorised",
      type : "unauthorised"
    },
    userNotFound: {
      label: "User not found",
      type : "notFound"
    }
  }
  /**
   * The handler name.
   *
   * @type {string}
   */
  name: string = "base"

  /**
   * The DB table to use.
   */
  table = ""

  /**
   * Object constructor.
   *
   * @param {DynamoDB} db
   *   The DB collection to use.
   */
  constructor(db: DynamoDB) {
    this.db = db
  }

  // /**
  //  * Delete the given item from the collection.
  //  *
  //  * @param {string} data
  //  *   The data to use when creating the item.
  //  *
  //  * @private
  //  */
  // protected collectionItemCreateMany(data: Array<TSchema>): Promise<InsertManyResult<TSchema>> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const updateData: OptionalUnlessRequiredId<any> = data
  //       const results: InsertManyResult<TSchema> =  await this.itemCollection.insertMany(updateData)
  //       resolve(results)
  //     }
  //     catch (error: unknown) {
  //       reject(error)
  //     }
  //   })
  // }
  //
  /**
   * Delete the given item from the db.
   *
   * @param {DynamoDB.UpdateItemInput} data
   *   The data to use when creating the item.
   *
   * @protected
   */
  protected dbItemUpdate(data: DynamoDB.UpdateItemInput): Promise<DynamoDB.UpdateItemOutput> {
    return new Promise(async (resolve, reject) => {
      try {

        const result = await this.db.updateItem(data).promise()
        resolve(result)
      }
      catch (error: unknown) {
        console.log("error", error)
        reject(error)
      }
    })
  }

  /**
   * Delete the given item from the collection.
   *
   * @param {string} data
   *   The data to use when creating the item.
   *
   * @private
   */
  protected dbItemCreate(data: DynamoDB.PutItemInput ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.putItem(data).promise()
        resolve(data.Item.id.S)
      }
      catch (error: unknown) {

        console.log("error", error)
        reject(error)
      }
    })
  }

  /**
   * Delete the given item from the collection.
   *
   * @param {string} id
   *   The ID of the item to delete.
   *
   * @private
   */
  protected dbItemDelete(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.deleteItem({
          TableName: this.table,
          Key      : { 'id': {S: id}}
        }).promise()

        resolve(true)
      }
      catch (error: unknown) {
        reject(error)
      }
    })
  }
  //
  // /**
  //  * Find an item in the collection using the given filters.
  //  *
  //  * @param {string} filterData
  //  *   The filters to filter by.
  //  *
  //  * @private
  //  */
  // protected collectionItemFindAll(filterData: object): Promise<FindCursor<WithId<TSchema>>> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const filters: Filter<any> = filterData
  //       const results = await this.itemCollection.find(filters)
  //
  //       if (results === null) {
  //         reject(new NotFoundError("Not found"))
  //       }
  //       else {
  //         resolve(results)
  //       }
  //     }
  //     catch (error: unknown) {
  //       reject(error)
  //     }
  //   })
  // }
  //
  // /**
  //  * Find an item in the collection using the given filters.
  //  *
  //  * @param {string} filterData
  //  *   The filters to filter by.
  //  *
  //  * @private
  //  */
  // protected collectionItemFind(filterData: object): Promise<WithId<TSchema>> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const filters: Filter<any> = filterData
  //       const results = await this.itemCollection.findOne(filters)
  //
  //       if (results === null) {
  //         reject(new NotFoundError("Not found"))
  //       }
  //       else {
  //         resolve(results)
  //       }
  //     }
  //     catch (error: unknown) {
  //       reject(error)
  //     }
  //   })
  // }
  //

  /**
   * Find an item in the collection using the ID.
   *
   * @param {string} id
   *   The ID of the item to find.
   *
   * @private
   */
  protected dbItemFindById(id: string): Promise<DynamoDB.GetItemOutput> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.getItem({
          TableName: this.table,
          Key      : { 'id': {S: id} }
        }).promise()

        if (result.Item) {
          resolve(result)
        }
        else {
          reject(new NotFoundError("Not found"))
        }
      }
      catch (error: unknown) {
        reject(error)
      }
    })
  }

  /**
   * Find an item in the collection using the ID.
   *
   * @param {DynamoDB.QueryInput} query
   *   The query to perform.
   *
   * @private
   */
  protected dbItemQuery(query: DynamoDB.QueryInput): Promise<DynamoDB.ItemList> {
    return new Promise(async (resolve, reject) => {
      try {

        const result = await this.db.query(query).promise()

        if (result.Items.length) {
          resolve(result.Items)
        }
        else {
          reject(new NotFoundError("Not found"))
        }
      }
      catch (error: unknown) {
        reject(error)
      }
    })
  }

  /**
   * Find an item in the collection using the ID.
   *
   * @param {DynamoDB.QueryInput} query
   *   The query to perform.
   *
   * @private
   */
  protected dbScan(query: DynamoDB.QueryInput): Promise<DynamoDB.ItemList> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.scan(query).promise()
        resolve(result.Items)
      }
      catch (error: unknown) {
        reject(error)
      }
    })
  }

  //
  // /**
  //  * Update an item in the collection using the ID.
  //  *
  //  * @param {string} id
  //  *   The ID of the item to update.
  //  * @param {DSchema} data
  //  *   The data to update.
  //  *
  //  * @private
  //  */
  // protected collectionItemUpdate<DSchema>(id: string, data: DSchema): Promise<boolean> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const objectID = new ObjectId(id)
  //       const filter: Filter<any>  = {_id: objectID}
  //       const update: Partial<any> = {"$set": data}
  //       const results  = await this.itemCollection.updateOne(
  //         filter,
  //         update
  //       )
  //
  //       if (results.matchedCount) {
  //         resolve(true)
  //       }
  //       else {
  //         reject(new NotFoundError("Not found"))
  //       }
  //     }
  //     catch (error: unknown) {
  //       reject(error)
  //     }
  //   })
  // }

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
    else {
      return this.generateError(
        HandlerBase.errorResponses.unexpectedError.type,
        HandlerBase.errorResponses.unexpectedError.label,
        JSON.stringify(error)
      )
    }
  }

  /**
   * Generate an error response.
   *
   * @param {string} type
   *   The type of error.
   * @param {string} message
   *   The error message
   * @param {origin} data
   *   Any additional data.
   *
   * @return {ErrorResponse}
   *
   * @private
   */
  public generateError(type: ErrorType, message: string, data?: string): ErrorResponse {
    return ErrorResponse.generateErrorResponse(type, this.name, message, data)
  }

  public uuidCreate (): string {
    return uuidv4()
  }
}