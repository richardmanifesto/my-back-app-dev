import {MongoClient, Collection, Db} from "mongodb"
import {addAnActivityRecord, mongoClientClose, mongoClientGet} from "./setup/helpers"
import {ErrorResponse}     from "../src/classes/ErrorResponse"
import {HandlerBase}       from "../src/classes/HandlerBase"
import {ActivityRecord}    from "../src/types/ActivityRecord"
import {ActivityHandler}   from "../src/classes/ActivityHandler"
import {TestActivities}    from "./data/Activities"


describe("UserAction CRUD operations", () => {
  let client: MongoClient
  let db: Db
  let configCollection: Collection<ActivityRecord>
  let handler: ActivityHandler

  beforeAll(async () => {
    client = await mongoClientGet()
  })

  afterAll(async () => {
    await mongoClientClose(client)
  })

  /**
   * Initialisation of data/collections/databases
   */
  beforeEach(async () => {
    const now = new Date().getTime().toString()

    //* Database name should be made as unique as we can make it to avoid collisions
    db = client.db(`${now}` + Math.floor(Math.random() * 1000).toString())

    const collections = await db.collections()

    for (const collection of collections) {
      await collection.deleteMany({})
    }

    configCollection = db.collection<ActivityRecord>("activity_record")
    handler          = new ActivityHandler(configCollection)
  })

  it("Can retrieve an existing activity by id.", async () => {
    const testActivityData = TestActivities[0]

    const newActivity = await addAnActivityRecord(
      configCollection,
      testActivityData.userId,
      testActivityData.date,
      testActivityData.values
    )

    const activity = await handler.activityGetById(newActivity.insertedId.toString())

    expect(activity.userId.toString()).toEqual(testActivityData.userId.toString())
    expect(activity.date).toEqual(testActivityData.date)
    Object.keys(testActivityData.values).forEach(key => {
      expect(testActivityData.values[key]).toEqual(activity.values[key])
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

    try {
      const user = await handler.activityGetById("123")
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

    expect(activity.userId.toString()).toEqual(testActivityData.userId.toString())
    expect(activity.date).toEqual(testActivityData.date)
    Object.keys(testActivityData.values).forEach(key => {
      expect(testActivityData.values[key]).toEqual(activity.values[key])
    })
  })

  it("Can update an existing activity.", async () => {
    const activityData       = TestActivities[0]
    const activityUpdateData = TestActivities[1]

    const activityId = await handler.activityCreate(activityData)
    await handler.activityUpdate(activityId, {
      date  : activityUpdateData.date,
      values: activityUpdateData.values,
    })

    const activity = await handler.activityGetById(activityId)


    expect(activity.date).toEqual(activityUpdateData.date)
    Object.keys(activityUpdateData.values).forEach(key => {
      expect(activityUpdateData.values[key]).toEqual(activity.values[key])
    })
  })

  it("Can expect to receive the correct error when an activity cannot be found to update.", async () => {

    const activityData = TestActivities[0]

    try {
      const user = await handler.activityUpdate("63c7354e206df4f5128e765a", activityData)
      expect(user).not.toBeTruthy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.activityNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.activityNotFound.label)
    }

    try {
      const user = await handler.activityUpdate("123", activityData)
      expect(user).not.toBeTruthy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.activityNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.activityNotFound.label)
    }
  })

  it("Can delete an existing activity.", async () => {
    const activityData  = TestActivities[0]
    const activityId    = await handler.activityCreate(activityData)
    const deleteSuccess = await handler.activityDelete(activityId)
    expect(deleteSuccess).toEqual(true)
  })

  it("Cannot delete an activity that doesn't exist.", async () => {
    try {
      await handler.activityDelete("63c7354e206df4f5128e765a")
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.activityNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.activityNotFound.label)
    }

    // Check for BSON error.
    try {
      await handler.activityDelete("1234")
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.activityNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.activityNotFound.label)
    }
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