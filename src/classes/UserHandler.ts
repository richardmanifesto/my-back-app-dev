import {Collection, Db} from "mongodb"
import {BSONError} from "bson"
import {UserRecord, UserRoleType, UserRoleTypes, UserUpdateRecord} from "../types/UserRecord"
import {HandlerBase}   from "./HandlerBase"
import {ErrorResponse} from "./ErrorResponse"
import {NotFoundError} from "./NotFoundError"


/**
 * UserHandler class.
 */
export class UserHandler extends HandlerBase<UserRecord, UserUpdateRecord> {

  /**
   * The encryption algorithm to use
   *
   * @type {string}
   */
  encryptionAlgorithm = 'sha256'

  /**
   * The encryption key to use
   *
   * @type {string}
   */
  encryptionKey: string

  /**
   * The handler name.
   *
   * @type {string}
   */
  name = "user_handler"

  /**
   * Protected fields
   *
   * These fields can only be updated by an admin
   *
   * @type {Array<string>}
   */
  static protectedFields = [
    "role"
  ]

  /**
   * Available fields
   *
   * @type {Array<string>}
   */
  static availableFields = [
    "ailment_description",
    "date_of_birth",
    "email_address",
    "first_name",
    "last_name",
    "role",
  ]

  constructor(encryptionKey: string, itemCollection: Collection<UserRecord>) {
    super()
    this.encryptionKey  = encryptionKey
    this.itemCollection = itemCollection
  }

  static canUpdateField(fieldName, userRole: UserRoleType): boolean {
    if (UserHandler.availableFields.includes(fieldName)) {
      if (UserHandler.protectedFields.includes(fieldName)) {
        return userRole === "admin"
      }
      else {
        return true
      }
    }

    return false
  }

  /**
   * Static create function.
   *
   * @param {Db} db
   *   An instantiated DB object.
   */
  static async create(db: Db) {
    const collection = db.collection<UserRecord>("user_records")
    await collection.createIndex( { email_address: 1 }, { unique: true } )
    return new UserHandler(process.env.CRYP_KEY, collection)
  }

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
    else if (error instanceof BSONError ) {
      return this.generateError(
        HandlerBase.errorResponses.userNotFound.type,
        HandlerBase.errorResponses.userNotFound.label,
        error.message
      )
    }
    else if (error instanceof NotFoundError ) {
      return this.generateError(
        HandlerBase.errorResponses.userNotFound.type,
        HandlerBase.errorResponses.userNotFound.label,
        error.message
      )
    }
    else {
      if (error.code && error.code === 11000) {
        return this.generateError(
          HandlerBase.errorResponses.userExists.type,
          HandlerBase.errorResponses.userExists.label,
          JSON.stringify(error)
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

  /**
   * Encrypt the password.
   *
   * @param {string} password
   *   The password to encrypt.
   *
   * @private
   */
  private passwordEncrypt(password: string): Promise<string> {
    return new Promise(async (resolve) => {
      const { createHmac } = await import('node:crypto')

      const passwordHash = createHmac(this.encryptionAlgorithm, this.encryptionKey)
        .update(password)
        .digest('hex')

      resolve(passwordHash)
    })
  }

  /**
   * Create a new user.
   *
   * @param {UserRecord} userData
   *   The user data to insert.
   *
   * @return {Promise<string>}
   *   The ID of the newly inserted record.
   */
  userCreate(userData: UserRecord): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (userData.password) {
          userData.password = await this.passwordEncrypt(userData.password)
        }

        const result = await this.collectionItemCreate(userData)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Create a new user.
   *
   * @param {string} userEmailAddress
   *   The user email address to validate.
   * @param {string} password
   *   The user password to validate.
   *
   * @return {Promise<string>}
   *   The ID of the newly inserted record.
   */
  userValidateLogin(userEmailAddress: string, password: string): Promise<UserRecord> {
    return new Promise(async (resolve, reject) => {
      const passwordHash = await this.passwordEncrypt(password)

      try {
        const filter: UserUpdateRecord = {
          email_address: userEmailAddress,
          password     : passwordHash
        }
        const result = await this.collectionItemFind(filter)
        resolve(result)
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
   * @return {Promise<boolean>}
   *   A boolean indicating the user was deleted successfully.
   */
  userDelete(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemDelete(id)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Validate that the given role is a valid role.
   *
   * @param {string} role
   *   The role to check.
   */
  validateUserRole(role: string) {
    return UserRoleTypes.includes(role)
  }

  /**
   * Update an existing user.
   *
   * @param {string} id
   *   The user ID
   * @param {UserRoleType} role
   *   The user role type.
   */
  userRoleSet(id: string, role: UserRoleType) {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await this.collectionItemUpdate(id, {role: role})
        resolve(results)
      }
      catch (error) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Retrieve a user by email.
   *
   * @param {string} userEmail
   *   The email address of the user to retrieve.
   *
   * @return {Promise<UserRecord>}
   *   The retrieved user record.
   */
  userGetByEmail(userEmail: string): Promise<UserRecord> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemFind({email_address: userEmail})
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
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
  userGetById(id: string): Promise<UserRecord> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionItemFindById(id)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Update an existing user.
   *
   * @param {string} id
   *   The user ID
   * @param {UserUpdateRecord} data
   *   The user update record
   */
  userUpdate(id: string, data: UserUpdateRecord) {
    return new Promise(async (resolve, reject) => {
      try {

        if (data.password) {
          data.password = await this.passwordEncrypt(data.password)
        }

        await this.collectionItemUpdate(id, data)
        resolve({})
      }
      catch (error) {
        reject(this.errorThrow(error))
      }
    })
  }
}

