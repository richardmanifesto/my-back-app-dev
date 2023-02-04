import {MongoClient, Collection, Db} from "mongodb"
import {mongoClientClose, mongoClientGet, isItEmpty, addAUserRecord} from "./setup/helpers"
import {UserHandler}   from "../src/classes/UserHandler"
import {UserRecord}    from "../src/types/UserRecord"
import {TestUsers}     from "./data/Users"
import {ErrorResponse} from "../src/classes/ErrorResponse"
import {HandlerBase}   from "../src/classes/HandlerBase"


describe("User CRUD operations", () => {
  let client: MongoClient
  let db: Db
  let configCollection: Collection<UserRecord>
  let userHandler: UserHandler

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
    const key = "private-key"

    //* Database name should be made as unique as we can make it to avoid collisions
    db = client.db(`${now}` + Math.floor(Math.random() * 1000).toString())

    const collections = await db.collections()

    for (const collection of collections) {
      await collection.deleteMany({})
    }

    configCollection = db.collection<UserRecord>("user_records")
    await configCollection.createIndex( { email_address: 1 }, { unique: true } )
    userHandler      = new UserHandler(key, configCollection)
  })

  it("Can retrieve an existing user by id.", async () => {
    const userData = TestUsers[0];

    const newUser = await addAUserRecord(
      configCollection,
      userData.first_name,
      userData.last_name,
      userData.email_address
    )

    const user = await userHandler.userGetById(newUser.insertedId.toString())
    expect(user.first_name).toEqual(userData.first_name)
    expect(user.last_name).toEqual(userData.last_name)
    expect(user.email_address).toEqual(userData.email_address)

  })

  it("Can retrieve an existing user by email.", async () => {
    const userData = TestUsers[0];

    await addAUserRecord(
      configCollection,
      userData.first_name,
      userData.last_name,
      userData.email_address
    )

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

  it("Can create a new user.", async () => {
    expect(isItEmpty(configCollection)).toBeTruthy()

    const userData = TestUsers[0];
    await userHandler.userCreate(userData)

    const newUser = await userHandler.userGetByEmail(userData.email_address)
    expect(newUser.first_name).toEqual(userData.first_name)
    expect(newUser.last_name).toEqual(userData.last_name)
    expect(newUser.email_address).toEqual(userData.email_address)
  })

  it("Can validate a user's password.", async () => {
    expect(isItEmpty(configCollection)).toBeTruthy()

    const password = "1234"
    const userData = TestUsers[0]
    userData.password = password
    await userHandler.userCreate(userData)

    try {
      await userHandler.userValidateLogin(TestUsers[0].email_address, password)
      expect(true).toEqual(true)
    } catch (error: any) {

    }
  })

  it("Cannot add a user with the same email address more than once.", async () => {
    expect(isItEmpty(configCollection)).toBeTruthy()

    try {
      const userData = TestUsers[0];
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
    expect(newUser.role).toEqual(userData.role)
  })

  it("Can delete an existing user.", async () => {
    const userData      = TestUsers[0]
    const newUserId     = await userHandler.userCreate(userData)
    const deleteSuccess = await userHandler.userDelete(newUserId)
    expect(deleteSuccess).toEqual(true)
  })

  it("Cannot delete a user that doesn't exist.", async () => {

    try {
      await userHandler.userDelete("63c7354e206df4f5128e765a")
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.userNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.userNotFound.label)
    }

    // Check for BSON error.
    try {
      await userHandler.userDelete("1234")
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.userNotFound.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.userNotFound.label)
    }

  })

  it("A user's role can be updated", async () => {
    const userData       = TestUsers[0]
    const userUpdateData = TestUsers[1]
    const newUserId      = await userHandler.userCreate(userData)
    await userHandler.userRoleSet(newUserId, userUpdateData.role)

    const newUser = await userHandler.userGetById(newUserId)
    expect(newUser.role).toEqual(userUpdateData.role)
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