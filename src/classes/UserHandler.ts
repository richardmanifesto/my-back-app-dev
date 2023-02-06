import {DynamoDB}       from "aws-sdk"
import {HandlerBase}    from "@root/src/classes/HandlerBase"
import {ErrorResponse}  from "./ErrorResponse"
import {NotFoundError}  from "./NotFoundError"
import {UserRecord, UserUpdateRecord, UserRoleType, UserRoleTypes} from "@root/src/types/UserRecord"


/**
 * UserHandler class.
 */
export class UserHandler extends HandlerBase<UserRecord> {

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
   * Protected fields
   *
   * These fields can only be updated by an admin
   *
   * @type {Array<string>}
   */
  static fieldsProtected = [
    "role"
  ]

  /**
   * Available fields
   *
   * @type {Array<string>}
   */
  static fieldsAvailable = [
    "ailment_description",
    "date_of_birth",
    "email_address",
    "first_name",
    "last_name",
    "role",
  ]

  /**
   * The handler name.
   *
   * @type {string}
   */
  name = "user_handler"

  /**
   * The DB table to use.
   */
  table = "users"

  /**
   * Object constructor.
   *
   * @param {string} encryptionKey
   *   The encryption key to use
   * @param {DynamoDB} db
   *   The DB collection to use.
   */
  constructor(encryptionKey: string, db: DynamoDB) {
    super(db)
    this.encryptionKey  = encryptionKey
  }

  /**
   * Check if the given user role can update the given fields.
   *
   * @param {string} fieldName
   *   The name of the field to check.
   * @param {UserRoleType} userRole
   *   The user role to check for.
   */
  static canUpdateField(fieldName, userRole: UserRoleType): boolean {
    if (UserHandler.fieldsAvailable.includes(fieldName)) {
      if (UserHandler.fieldsProtected.includes(fieldName)) {
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
   * @param {DynamoDB} db
   *   An instantiated DB object.
   */
  static async create(db: DynamoDB) {
    return new UserHandler(process.env.CRYP_KEY, db)
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
    else if (error instanceof NotFoundError ) {
      return this.generateError(
        HandlerBase.errorResponses.userNotFound.type,
        HandlerBase.errorResponses.userNotFound.label,
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
        const userExists = await this.userExists(userData.email_address)

        if (userExists) {
          throw this.generateError(
            HandlerBase.errorResponses.userExists.type,
            HandlerBase.errorResponses.userExists.label
          )
        }

        userData.id = this.uuidCreate()

        if (userData.password) {
          userData.password = await this.passwordEncrypt(userData.password)
        }

        const item: DynamoDB.PutItemInput = {
          Item                 : {
            id                 : {"S": userData.id},
            first_name         : {"S": userData.first_name},
            last_name          : {"S": userData.last_name},
            email_address      : {"S": userData.email_address},
            date_of_birth      : {"S": userData.date_of_birth ? userData.date_of_birth : ""},
            user_role          : {"S": userData.user_role ? userData.user_role : "user"},
            ailment_description: {"S": userData.ailment_description ? userData.ailment_description : ""},
            password           : {"S": userData.password ? userData.password : ""}
          },
          TableName             : this.table,
          ReturnConsumedCapacity: "TOTAL"
        }

        const id = await this.dbItemCreate(item)
        resolve(id)
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
        const result = await this.dbItemDelete(id)
        resolve(result)
      }
      catch (error: unknown) {
        reject(this.errorThrow(error))
      }
    })
  }

  /**
   * Check if a user exists..
   *
   * @param {string} userEmail
   *   The email address of the user to retrieve.
   *
   * @return {Promise<boolean>}
   *   A boolean indicating if the user exists.
   */
  userExists(userEmail: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userGetByEmail(userEmail)
        resolve(true)
      }
      catch (error: any) {
        if (error instanceof ErrorResponse) {
          if (error.type === "notFound") {
            resolve(false)
          }
        }

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
        const query = {
          TableName                : this.table,
          IndexName                : "email_index",
          ExpressionAttributeValues: { ":e": {S: userEmail} },
          KeyConditionExpression   : "email_address = :e"
        }

        const results = await this.dbItemQuery(query)

        resolve({
          id                 : results[0].id.S,
          first_name         : results[0].first_name.S,
          last_name          : results[0].last_name.S,
          email_address      : results[0].email_address.S,
          ailment_description: results[0].ailment_description.S,
          user_role          : results[0].user_role.S,
          date_of_birth      : results[0].date_of_birth.S,
        })
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
        const result = await this.dbItemFindById(id)
        resolve({
          id                 : result.Item.id.S,
          first_name         : result.Item.first_name.S,
          last_name          : result.Item.last_name.S,
          email_address      : result.Item.email_address.S,
          ailment_description: result.Item.ailment_description.S,
          user_role          : result.Item.user_role.S,
          date_of_birth      : result.Item.date_of_birth.S,
        })
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
   * @param {UserRoleType} role
   *   The user role type.
   */
  userRoleSet(id: string, role: UserRoleType) {
    return new Promise(async (resolve, reject) => {
      try {
        const updateQuery = {
          TableName                : this.table,
          Key                      : { 'id': {S: id} },
          UpdateExpression         : `set user_role = :user_role`,
          ExpressionAttributeValues: { ':user_role': {S: role} }
        }

        const results = await this.dbItemUpdate(updateQuery)
        resolve(results)
      }
      catch (error) {
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

        const updateExpression = Object.keys(data).reduce((expressionList, currentKey) => {
          expressionList.expressions.push(`${currentKey} = :${currentKey}`)
          expressionList.values[`:${currentKey}`] = {S: data[currentKey]}
          return expressionList
        }, {expressions:  [], values: {}})

        const updateQuery = {
          TableName                : this.table,
          Key                      : { 'id': {S: id}},
          UpdateExpression         : `set ${updateExpression.expressions.join(',')}`,
          ExpressionAttributeValues: updateExpression.values
        }

        const response = await this.dbItemUpdate(updateQuery)
        resolve({})
      }
      catch (error) {
        console.log(error)
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
        const result = await this.userGetByEmail(userEmailAddress)

        if (result.password === passwordHash) {
          resolve(result)
        }
        else {
          reject(
            this.generateError(
              HandlerBase.errorResponses.userUnauthorised.type,
              HandlerBase.errorResponses.userUnauthorised.label
            )
          )
        }

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
}