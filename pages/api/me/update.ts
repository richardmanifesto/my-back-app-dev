import type { NextApiRequest, NextApiResponse } from 'next'
import {ApiErrorResponse}             from "@root/src/types/ApiErrorResponse"
import {ErrorResponse}                from "@root/src/classes/ErrorResponse"
import {SessionHandler}               from "@root/src/classes/SessionHandler"
import {UserRecord, UserUpdateRecord} from "@root/src/types/UserRecord"
import {UserHandler}                  from "@root/src/classes/UserHandler"
import {DatabaseConnection}           from "@root/src/utility/Database"

/**
 * UpdateResponse
 */
type UpdateResponse = {

}

/**
 * requestHandler
 *
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
export default async function requestHandler(req: NextApiRequest, res: NextApiResponse<UpdateResponse|ApiErrorResponse>) {
  if (req.method === 'POST') {
    await handlePostRequest(req, res)
  }
  else {
    res.status(404)
      .json({
        message: "Route not found"
      })
  }
}

/**
 * Handle any POST requests that have been made.
 *
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse<UpdateResponse|ApiErrorResponse>) => {
  try {
    const sessionHandler = SessionHandler.create()
    const sessionToken   = SessionHandler.sessionTokenGet(req.headers.cookie)
    const claim          = await sessionHandler.tokenVerify(sessionToken)

    const db          = await DatabaseConnection()
    const userHandler = await UserHandler.create(db)
    const updateRecord: UserUpdateRecord = {}

    Object.keys(req.body).forEach(fieldName => {
      if (UserHandler.canUpdateField(fieldName, claim.role)) {
        updateRecord[fieldName] = req.body[fieldName]
      }
    })

    await userHandler.userUpdate(claim.userId, updateRecord)
    res.status(200)
      .json({})
  }
  catch (error: any) {
    if (error instanceof ErrorResponse) {
      res.status(error.responseCodeGet())
        .json({
          message: error.message,
          data   : error.data
        })
    }
    else {
      res.status(500)
        .json({
          message: error.message
        })
    }
  }
}
