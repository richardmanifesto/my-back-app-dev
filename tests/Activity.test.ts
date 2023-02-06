import { config, DynamoDB } from 'aws-sdk'
import {ActivityHandler}    from "@root/src/classes/ActivityHandler"
import {ErrorResponse}      from "@root/src/classes/ErrorResponse"
import {HandlerBase}        from "@root/src/classes/HandlerBase"
import {TestActivities}     from "@root/tests/data/Activities"

describe("UserAction CRUD operations", () => {
  let db: DynamoDB
  let handler: ActivityHandler

  beforeAll(async () => {
    process.env.AWS_ACCESS_KEY_ID     = "1234"
    process.env.AWS_SECRET_ACCESS_KEY = "1234"

    config.update({
      region  : "us-west-2",
      // @ts-ignore
      endpoint: "http://localhost:8000"
    })

    db = new DynamoDB()
  })

  /**
   * Initialisation of data/collections/databases
   */
  beforeEach(async () => {
    handler = new ActivityHandler(db)

    const rows = await db.scan({
      TableName      : handler.table,
      AttributesToGet: ['id']
    }).promise()

    for (let i =0; i < rows.Items.length; i++) {
      const item = rows.Items[i]
      await db.deleteItem({ TableName: handler.table, Key: item }).promise()
    }
  })

  it("Can retrieve an existing activity by id.", async () => {
    const testActivityData = TestActivities[0]
    const newActivityId = await handler.activityCreate(testActivityData)
    const activity      = await handler.activityGetById(newActivityId)


    expect(activity.userId).toEqual(testActivityData.userId)
    expect(activity.activity_date).toEqual(testActivityData.activity_date)
    Object.keys(testActivityData.activity_values).forEach(key => {
      expect(testActivityData.activity_values[key]).toEqual(activity.activity_values[key])
    })
  })

  it("Can expect to receive the correct error when an activity cannot be found.", async () => {
    try {
      const user = await handler.activityGetById("63c7354e206df4f5128e765a")
      expect(user).not.toBeTruthy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.activityNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.activityNotFound.label)
    }
  })

  it("Can create an activity", async () => {
    const testActivityData = TestActivities[0]

    const activityId = await handler.activityCreate(testActivityData)
    const activity   = await handler.activityGetById(activityId)

    expect(activity.userId).toEqual(testActivityData.userId)
    expect(activity.activity_date).toEqual(testActivityData.activity_date)
    Object.keys(testActivityData.activity_values).forEach(key => {
      expect(testActivityData.activity_values[key]).toEqual(activity.activity_values[key])
    })
  })

  it("Can update an existing activity.", async () => {
    const activityData       = TestActivities[0]
    const activityUpdateData = TestActivities[1]

    const activityId = await handler.activityCreate(activityData)
    await handler.activityUpdate(activityId, {
      activity_date  : activityUpdateData.activity_date,
      activity_values: activityUpdateData.activity_values,
    })

    const activity = await handler.activityGetById(activityId)

    expect(activity.activity_date).toEqual(activityUpdateData.activity_date)
    Object.keys(activityUpdateData.activity_values).forEach(key => {
      expect(activityUpdateData.activity_values[key]).toEqual(activity.activity_values[key])
    })
  })

  it("Can get the user activity for a given date", async () => {
    const testActivityData = TestActivities[0]
    await handler.activityCreate(testActivityData)
    const activity = await handler.activityGetForUserByDate(testActivityData.userId, testActivityData.activity_date)

    expect(activity.userId).toEqual(testActivityData.userId)
    expect(activity.activity_date).toEqual(testActivityData.activity_date)
    Object.keys(testActivityData.activity_values).forEach(key => {
      expect(testActivityData.activity_values[key]).toEqual(activity.activity_values[key])
    })
  })

  // it("Can get a paginated set of activity records for a given user", async () => {
  //
  //   let userItemCount = 0
  //   const userId      = "63c7354e206df4f5128e765a"
  //   const notUserId   = "29c7354e206df4f5128e765a"
  //
  //   for(let i =0; i < TestActivities.length; i++) {
  //     const testActivityData = TestActivities[i]
  //
  //     await addAnActivityRecord(
  //       configCollection,
  //       testActivityData.userId,
  //       testActivityData.type,
  //       testActivityData.date,
  //       testActivityData.value
  //     )
  //
  //     if (testActivityData.userId.toString() === userId) {
  //       userItemCount++
  //     }
  //   }
  //
  //   const pageOneResults = await handler.getPageForUser(userId)
  //   const pageOneUserIds = pageOneResults.items.map(item => item.userId.toString())
  //
  //   expect(pageOneResults.items.length).toEqual(10)
  //   expect(pageOneUserIds).toContain(userId)
  //   expect(pageOneUserIds).not.toContain(notUserId)
  //   expect(pageOneResults).toHaveProperty("nextPage")
  //
  //
  //   const pageTwoResults = await handler.getPageForUser(userId, 1)
  //   const pageTwoUserIds = pageOneResults.items.map(item => item.userId.toString())
  //
  //   expect(pageTwoResults.items.length).toEqual(userItemCount - handler.pageSize)
  //   expect(pageTwoUserIds).toContain(userId)
  //   expect(pageTwoUserIds).not.toContain(notUserId)
  //   expect(pageTwoResults).not.toHaveProperty("nextPage")
  //
  // })
})