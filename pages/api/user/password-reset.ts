import type { NextApiRequest, NextApiResponse } from 'next'
import {DatabaseConnection} from "@root/src/utility/Database"
import {ApiErrorResponse}   from "@root/src/types/ApiErrorResponse"
import {ErrorResponse}      from "@root/src/classes/ErrorResponse"
import {UserActionHandler}  from "@root/src/classes/UserActionHandler"
import {UserHandler}        from "@root/src/classes/UserHandler"

/**
 * ApiSessionResponse.
 */
type ApiResponse = {

}

/**
 * requestHandler
 *
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
export default async function requestHandler(req: NextApiRequest, res: NextApiResponse<ApiResponse|ApiErrorResponse>) {
  if (req.method === 'POST') {
    await handlePostRequest(req, res)
  }
  else {
    res.status(404)
      .json({ message: "Route not found" })
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
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse<ApiResponse|ApiErrorResponse>) => {
  const db                = await DatabaseConnection()
  const userActionHandler = await UserActionHandler.create(db)
  const userHandler       = await UserHandler.create(db)

  try {
    const user = await  userHandler.userGetByEmail(req.body.email_address)
    await userActionHandler.actionCreate(user.id, "password_reset")
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
