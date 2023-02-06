import {DynamoDB}       from "aws-sdk"
import {ActivityRecord, ActivityRecordValues, ActivityUpdateRecord} from "@root/src/types/ActivityRecord"
import {HandlerBase}   from "./HandlerBase"
import {ErrorResponse} from "./ErrorResponse"
import {NotFoundError} from "./NotFoundError"
import {DataPage}      from "@root/src/types/DataPage"
;

/**
 * UserHandler class.
 */
export class ActivityHandler extends HandlerBase<ActivityRecord> {

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

  /**
   * The DB table to use.
   */
  table = "activity"

  /**
   * @inheritDoc
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
    return new ActivityHandler(db)
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

        const activityID = `${data.userId}_${data.activity_date}`

        await this.dbItemCreate({
          Item             : {
            id             : {"S": activityID},
            userId         : {"S": data.userId},
            activity_date  : {"S": data.activity_date},
            activity_values: {"M": this.valuesMapBuild(data.activity_values)},
          },
          TableName             : this.table,
          ReturnConsumedCapacity: "TOTAL"
        })

        resolve(activityID)
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
    return this.dbItemDelete(id)
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
        const result = await this.dbItemFindById(id)

        resolve({
          id             : result.Item.id.S,
          userId         : result.Item.userId.S,
          activity_date  : result.Item.activity_date.S,
          activity_values: this.valuesMapFlatten(result.Item.activity_values.M)
        })
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Retrieve an activity by ID.
   *
   * @param {string} userId
   *   The userId to retrieve the activity for.
   * @param {string} date
   *   The date to retrieve the activity for
   *
   * @return {Promise<UserRecord>}
   *   The retrieved user record.
   */
  activityGetForUserByDate(userId: string, date: string): Promise<ActivityRecord> {
    return this.activityGetById(`${userId}_${date}`)
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

        const updateExpression = Object.keys(data)
          .reduce((expressionList, currentKey) => {
            expressionList.expressions.push(`${currentKey} = :${currentKey}`)

            if (currentKey === 'activity_values') {
              expressionList.values[`:${currentKey}`] = {M: this.valuesMapBuild(data[currentKey])}
            }
            else {
              expressionList.values[`:${currentKey}`] = {S: data[currentKey]}
            }
          return expressionList
        }, {expressions:  [], values: {}})

        const updateQuery = {
          TableName                  : this.table,
          Key                        : { 'id': {S: id}},
          UpdateExpression           : `set ${updateExpression.expressions.join(',')}`,
          ExpressionAttributeValues  : updateExpression.values,
          ReturnItemCollectionMetrics: "SIZE"
        }

        await this.dbItemUpdate(updateQuery)
        resolve({})
      }
      catch (error) {
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
  activityUpsert(data: ActivityRecord) {
    return new Promise(async (resolve, reject) => {
      const id = `${data.userId}_${data.activity_date}`

      try {
        await this.activityGetById(id)
        await this.activityUpdate(id, data)
        resolve(true)
      }
      catch (error: any) {
        if (error instanceof ErrorResponse) {
          if (error.type === "notFound") {

            try {
              await this.activityCreate(data)
              resolve(true)
            }
            catch (innerError: any) {
              reject(this.errorThrow(error))
            }
          }
          else {
            reject(this.errorThrow(error))
          }
        }
        else {
          reject(this.errorThrow(error))
        }
      }
    })
  }



  /**
   * Build the value map
   * @param {ActivityRecordValues} values
   *   The values to build the map for.
   *
   * @return {DynamoDB.MapAttributeValue}
   *
   * @private
   */
  private valuesMapBuild(values: ActivityRecordValues): DynamoDB.MapAttributeValue {
    return Object.keys(values).reduce((map, currentKey) => {
      map[currentKey] = {S: values[currentKey].toString()}
      return map
    }, {})
  }

  /**
   * Flatten the given value map
   *
   * @param {DynamoDB.MapAttributeValue} values
   *   The values to build the map for.
   *
   * @return {ActivityRecordValues}
   *
   * @private
   */
  private valuesMapFlatten(values: DynamoDB.MapAttributeValue): ActivityRecordValues {
    return Object.keys(values).reduce((map, currentKey) => {
      map[currentKey] = values[currentKey].S
      return map
    }, {})
  }

  // /**
  //  * Create a new activity.
  //  *
  //  * @param {ActivityRecord} data
  //  *   The activity data to insert.
  //  *
  //  * @return {Promise<string>}
  //  *   The ID of the newly inserted record.
  //  */
  // activityUpsert(data: ActivityRecord, filter: Filter<any>): Promise<UpdateResult> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const result = await this.collectionItemUpsert(data, filter)
  //       resolve(result)
  //     }
  //     catch (error: unknown) {
  //       reject(this.errorThrow(error))
  //     }
  //   })
  // }
  //
  // getPageForUser(userId: string, page: number = 0): Promise<DataPage> {
  //   return new Promise((resolve, reject) => {
  //     this.itemCollection
  //       .find({userId: {$eq: new ObjectId(userId)}})
  //       .skip(this.pageSize * page)
  //       .limit(this.pageSize)
  //       .toArray()
  //       .then((results: WithId<ActivityRecord>[]) => {
  //         const dataPage: DataPage = {
  //           items      : results ? results : [],
  //           currentPage: page
  //         }
  //
  //         if (dataPage.items.length === this.pageSize) {
  //           dataPage.nextPage = page +1
  //         }
  //
  //         resolve(dataPage)
  //       })
  //       .catch(error => {
  //         reject(
  //           this.generateError(
  //             HandlerBase.errorResponses.unexpectedError.type,
  //             HandlerBase.errorResponses.unexpectedError.label,
  //             JSON.stringify(error)
  //           )
  //         )
  //       })
  //   })
  //
  // }

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

