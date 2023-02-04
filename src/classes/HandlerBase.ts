import {ErrorType, ErrorResponse} from "./ErrorResponse"
import {NotFoundError} from "./NotFoundError"
import {ServiceBaseErrorResponse} from "../types/ServiceBaseErrorResponse"
import {
  BSON,
  Collection,
  FindCursor,
  InsertManyResult,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateResult,
  WithId
} from "mongodb"
import {Filter} from "mongodb/src/mongo_types"

/**
 * ServiceBase class.
 *
 * Bass class for the Data Service.
 */
export class HandlerBase<TSchema extends BSON.Document, DSchema> {

  /**
   * The user db collection.
   *
   * @type {Collection<T>}
   */
  itemCollection: Collection<TSchema>

  /**
   * The handler name.
   *
   * @type {string}
   */
  name: string = "base"

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
    userNotFound: {
      label: "User not found",
      type : "notFound"
    }
  }

  /**
   * Delete the given item from the collection.
   *
   * @param {string} data
   *   The data to use when creating the item.
   *
   * @private
   */
  protected collectionItemCreateMany(data: Array<TSchema>): Promise<InsertManyResult<TSchema>> {
    return new Promise(async (resolve, reject) => {
      try {
        const updateData: OptionalUnlessRequiredId<any> = data
        const results: InsertManyResult<TSchema> =  await this.itemCollection.insertMany(updateData)
        resolve(results)
      }
      catch (error: unknown) {
        reject(error)
      }
    })
  }

  /**
   * Delete the given item from the collection.
   *
   * @param {string} data
   *   The data to use when creating the item.
   * @param {Filter<any>} query
   *   The query to perform the upsert on.
   *
   * @private
   */
  protected collectionItemUpsert(data: TSchema, query: Filter<any>): Promise<UpdateResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const updateData: OptionalUnlessRequiredId<any> = data
        const results =  await this.itemCollection.updateOne(query, { $set: updateData }, { upsert: true })
        resolve(results)
      }
      catch (error: unknown) {
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
  protected collectionItemCreate(data: TSchema): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const updateData: OptionalUnlessRequiredId<any> = data
        const results =  await this.itemCollection.insertOne(updateData)
        resolve(results.insertedId.toString())
      }
      catch (error: unknown) {
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
  protected collectionItemDelete(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const objectID = new ObjectId(id)
        const filter: Filter<any> = {_id: objectID}
        const results  = await this.itemCollection.deleteOne(filter)

        if (results.deletedCount) {
          resolve(true)
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
   * Find an item in the collection using the given filters.
   *
   * @param {string} filterData
   *   The filters to filter by.
   *
   * @private
   */
  protected collectionItemFindAll(filterData: object): Promise<FindCursor<WithId<TSchema>>> {
    return new Promise(async (resolve, reject) => {
      try {
        const filters: Filter<any> = filterData
        const results = await this.itemCollection.find(filters)

        if (results === null) {
          reject(new NotFoundError("Not found"))
        }
        else {
          resolve(results)
        }
      }
      catch (error: unknown) {
        reject(error)
      }
    })
  }

  /**
   * Find an item in the collection using the given filters.
   *
   * @param {string} filterData
   *   The filters to filter by.
   *
   * @private
   */
  protected collectionItemFind(filterData: object): Promise<WithId<TSchema>> {
    return new Promise(async (resolve, reject) => {
      try {
        const filters: Filter<any> = filterData
        const results = await this.itemCollection.findOne(filters)

        if (results === null) {
          reject(new NotFoundError("Not found"))
        }
        else {
          resolve(results)
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
   * @param {string} id
   *   The ID of the item to find.
   *
   * @private
   */
  protected collectionItemFindById(id: string): Promise<WithId<TSchema>> {
    return new Promise(async (resolve, reject) => {
      try {
        const objectID = new ObjectId(id)
        const filter: Filter<any> = {_id: objectID}
        const results = await this.collectionItemFind(filter)
        resolve(results)
      }
      catch (error: unknown) {
        reject(error)
      }
    })
  }

  /**
   * Update an item in the collection using the ID.
   *
   * @param {string} id
   *   The ID of the item to update.
   * @param {DSchema} data
   *   The data to update.
   *
   * @private
   */
  protected collectionItemUpdate<DSchema>(id: string, data: DSchema): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const objectID = new ObjectId(id)
        const filter: Filter<any>  = {_id: objectID}
        const update: Partial<any> = {"$set": data}
        const results  = await this.itemCollection.updateOne(
          filter,
          update
        )

        if (results.matchedCount) {
          resolve(true)
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
}