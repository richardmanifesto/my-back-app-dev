import type { NextApiRequest, NextApiResponse } from 'next'
import {DatabaseConnection} from "@root/src/utility/Database"
import {ApiErrorResponse}   from "@root/src/types/ApiErrorResponse"
import {UserRecord}         from "@root/src/types/UserRecord"
import {UserActionHandler}  from "@root/src/classes/UserActionHandler"
import {UserHandler}        from "@root/src/classes/UserHandler"
import {ErrorResponse}      from "@root/src/classes/ErrorResponse"

/**
 * CreateResponse
 */
type CreateResponse = {
  name              : string
  verificationToken?: string
}

/**
 * requestHandler
 *
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
export default async function requestHandler(req: NextApiRequest, res: NextApiResponse<CreateResponse|ApiErrorResponse>) {
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
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse<CreateResponse|ApiErrorResponse>) => {
  const db                = await DatabaseConnection()
  const userHandler       = await UserHandler.create(db)
  const userActionHandler = await UserActionHandler.create(db)

  const newUser: UserRecord = {
    ailment_description: req.body.ailment_description,
    date_of_birth      : req.body.date_of_birth,
    email_address      : req.body.email_address,
    first_name         : req.body.first_name,
    last_name          : req.body.last_name,
    role               : "user"
  }

  if (req.body.password) {
    newUser.password = req.body.password
  }

  try {
    const newUserId = await userHandler.userCreate(newUser)
    const verificationToken = await userActionHandler.actionCreate(newUserId, "account_verification")

    res.status(200)
      .json({ name: newUserId, verificationToken: verificationToken })
  }
  catch (error: any) {
    if (error instanceof ErrorResponse) {
      res.status(error.responseCodeGet())
        .json({ message: error.message, data: error.data })
    }
    else {
      res.status(500)
        .json({ message: error.message })
    }
  }
}
