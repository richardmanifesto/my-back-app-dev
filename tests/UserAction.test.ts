import {MongoClient, Collection, Db} from "mongodb"
import {mongoClientClose, mongoClientGet} from "./setup/helpers"
import {UserActionHandler} from "../src/classes/UserActionHandler"
import {UserActionRecord}  from "../src/types/UserActionRecord"
import {ErrorResponse}     from "../src/classes/ErrorResponse"
import {HandlerBase}       from "../src/classes/HandlerBase"


describe("UserAction CRUD operations", () => {
  let client: MongoClient
  let db: Db
  let configCollection: Collection<UserActionRecord>
  let handler: UserActionHandler

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

    configCollection = db.collection<UserActionRecord>("user_action_records")
    handler          = new UserActionHandler(configCollection)
  })

  it("Can create an action", async () => {
    const actionId = await handler.actionCreate("63c7354e206df4f5128e765a", "account_verification")
    const action   = await handler.actionGetById(actionId)

    expect(action.type).toEqual("account_verification")
    expect(action.userId.toString()).toEqual("63c7354e206df4f5128e765a")

  })

  it("Can claim an action.", async () => {
    const actionId = await handler.actionCreate("63c7354e206df4f5128e765a", "account_verification")
    const action   = await handler.actionClaim(actionId)

    expect(action.type).toEqual("account_verification")
    expect(action.userId.toString()).toEqual("63c7354e206df4f5128e765a")

    try {
      await handler.actionClaim(actionId)
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.actionNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.actionNotFound.label)
    }
  })

  it("Cannot claim an action that doesn't exist", async () => {

    try {
      await handler.actionClaim("63c7354e206df4f5128e765a")
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.actionNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.actionNotFound.label)
    }

    // Check for BSON error.
    try {
      await handler.actionClaim("1234")
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.actionNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.actionNotFound.label)
    }
  })

})