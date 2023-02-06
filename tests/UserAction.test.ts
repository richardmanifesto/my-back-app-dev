import { config, DynamoDB } from 'aws-sdk'
import {UserActionHandler}  from "@root/src/classes/UserActionHandler"
import {ErrorResponse}      from "@root/src/classes/ErrorResponse"
import {HandlerBase}        from "@root/src/classes/HandlerBase"

describe("UserAction CRUD operations", () => {
  let db: DynamoDB
  let handler: UserActionHandler

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
    handler = new UserActionHandler(db)

    const rows = await db.scan({
      TableName      : handler.table,
      AttributesToGet: ['id']
    }).promise()

    for (let i =0; i < rows.Items.length; i++) {
      const item = rows.Items[i]
      await db.deleteItem({ TableName: handler.table, Key: item }).promise()
    }
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
  })

})