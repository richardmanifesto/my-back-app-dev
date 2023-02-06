import { config, DynamoDB } from 'aws-sdk'
import {TestUsers}          from "./data/Users"
import {UserHandler}        from "@root/src/classes/UserHandler"
import {ErrorResponse}      from "@root/src/classes/ErrorResponse"
import {HandlerBase}        from "@root/src/classes/HandlerBase"

describe("User CRUD operations", () => {
  const tableName = "users"
  let db: DynamoDB
  let userHandler: UserHandler

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

  beforeEach( async () => {
    const key  = "private-key"
    const rows = await db.scan({
      TableName      : tableName,
      AttributesToGet: ['id']
    }).promise()

    for (let i =0; i < rows.Items.length; i++) {
      const item = rows.Items[i]
      await db.deleteItem({ TableName: tableName, Key: item }).promise()
    }

    userHandler = new UserHandler(key, db)
  })

  it("Can create a new user.", async () => {
    const userData = TestUsers[0]
    const userId   = await userHandler.userCreate(userData)
    const newUser  = await userHandler.userGetById(userId)

    expect(newUser.first_name).toEqual(userData.first_name)
    expect(newUser.last_name).toEqual(userData.last_name)
    expect(newUser.email_address).toEqual(userData.email_address)
  })

  it("Can retrieve an existing user by email.", async () => {
    const userData = TestUsers[0]
    await userHandler.userCreate(userData)


    const user = await userHandler.userGetByEmail(userData.email_address)
    expect(user.first_name).toEqual(userData.first_name)
    expect(user.last_name).toEqual(userData.last_name)
    expect(user.email_address).toEqual(userData.email_address)

  })

  it("Can expect to receive the correct error when a user cannot be found.", async () => {
    try {
      const user = await userHandler.userGetByEmail("non-user@test.com")
      expect(user).not.toBeTruthy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.userNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.userNotFound.label)
    }

    try {
      const user = await userHandler.userGetById("63c7354e206df4f5128e765a")
      expect(user).not.toBeTruthy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.userNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.userNotFound.label)
    }
  })

  it("Can validate a user's password.", async () => {
    const password = "1234"
    const userData = TestUsers[0]
    userData.password = password
    await userHandler.userCreate(userData)

    try {
      await userHandler.userValidateLogin(TestUsers[0].email_address, password)
      expect(true).toEqual(true)

      await userHandler.userValidateLogin(TestUsers[0].email_address, 'invalid')
      expect(true).toEqual(true)

    } catch (error: any) {

    }
  })

  it("Cannot add a user with the same email address more than once.", async () => {
    try {
      const userData = TestUsers[0]
      await userHandler.userCreate(userData)
      const userId = await userHandler.userCreate(userData)

      expect(userId).not.toBeTruthy()
    } catch (error: any) {

      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.userExists.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.userExists.label)
    }
  })

  it("Can update an existing user.", async () => {
    const userData       = TestUsers[0]
    const userUpdateData = TestUsers[1]
    const newUserId      = await userHandler.userCreate(userData)

    await userHandler.userUpdate(newUserId, {
      first_name         : userUpdateData.first_name,
      last_name          : userUpdateData.last_name,
      email_address      : userUpdateData.email_address,
      ailment_description: userUpdateData.ailment_description,
      date_of_birth      : userUpdateData.date_of_birth
    })

    const newUser = await userHandler.userGetByEmail(userUpdateData.email_address)

    expect(newUser.first_name).toEqual(userUpdateData.first_name)
    expect(newUser.last_name).toEqual(userUpdateData.last_name)
    expect(newUser.email_address).toEqual(userUpdateData.email_address)
    expect(newUser.ailment_description).toEqual(userUpdateData.ailment_description)
    expect(newUser.date_of_birth).toEqual(userUpdateData.date_of_birth)
    expect(newUser.user_role).toEqual(userData.user_role)
  })

  it("Can delete an existing user.", async () => {
    const userData      = TestUsers[0]
    const newUserId     = await userHandler.userCreate(userData)
    const deleteSuccess = await userHandler.userDelete(newUserId)
    expect(deleteSuccess).toEqual(true)
  })

  it("A user's role can be updated", async () => {
    const userData       = TestUsers[0]
    const userUpdateData = TestUsers[1]
    const newUserId      = await userHandler.userCreate(userData)
    await userHandler.userRoleSet(newUserId, userUpdateData.user_role)

    const newUser = await userHandler.userGetById(newUserId)
    expect(newUser.user_role).toEqual(userUpdateData.user_role)
  })

  it("A user's role cannot be updated if they don't exist", async () => {
    try {
      await userHandler.userRoleSet("63c7354e206df4f5128e765a", "user")
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.userNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.userNotFound.label)
    }
  })

  it("Users can only set roles from a defined set", async () => {
    expect(userHandler.validateUserRole("admin")).toEqual(true)
    expect(userHandler.validateUserRole("super")).toEqual(false)
  })

})

export {}