import type { NextApiRequest, NextApiResponse } from 'next'
import {DatabaseConnection} from "@root/src/utility/Database"
import {ApiErrorResponse}   from "@root/src/types/ApiErrorResponse"
import {ErrorResponse}      from "@root/src/classes/ErrorResponse"
import {SessionHandler}     from "@root/src/classes/SessionHandler"
import {UserHandler}        from "@root/src/classes/UserHandler"

/**
 * ApiSessionResponse.
 */
type ApiSessionResponse = {
  sessionId: string
}

/**
 * requestHandler
 *
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
export default async function requestHandler(req: NextApiRequest, res: NextApiResponse<ApiSessionResponse|ApiErrorResponse>) {
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
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse<ApiSessionResponse|ApiErrorResponse>) => {
  const db = await DatabaseConnection()
  const userHandler = await UserHandler.create(db)

  try {
    const user           = await userHandler.userValidateLogin(req.body.email_address, req.body.password)
    const sessionHandler = SessionHandler.create()
    const sessionToken   = await sessionHandler.tokenCreate({
      userId     : user.id,
      role       : user.user_role,
      isTemporary: false
    })

    res.status(200)
      .json({ sessionId: sessionToken })
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
