import {MongoClient}   from "mongodb"
import {Db}            from "mongodb"
import {ErrorResponse} from "../classes/ErrorResponse"

const dbName = "my_back_app"

/**
 * Generate a database connection.
 *
 * @constructor
 */
export const DatabaseConnection = (): Promise<Db> => {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(process.env["DB_CONNECTION"])

    client.connect()
      .then(() => {
        resolve(client.db(dbName))
      })
      .catch(error => {
        reject(
          ErrorResponse.generateErrorResponse(
            "unexpectedError",
            "DatabaseConnection",
            error
          )
        )
      })
  })
}