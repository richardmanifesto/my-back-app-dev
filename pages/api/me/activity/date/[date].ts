import type { NextApiRequest, NextApiResponse } from 'next'
import {DatabaseConnection} from "@root/src/utility/Database"
import {ErrorResponse}      from "@root/src/classes/ErrorResponse"
import {SessionHandler}     from "@root/src/classes/SessionHandler"
import {ActivityHandler}    from "@root/src/classes/ActivityHandler"
import {ActivityRecord}     from "@root/src/types/ActivityRecord"
import {ApiErrorResponse}   from "@root/src/types/ApiErrorResponse"
import {Claim}              from "@root/src/types/Claim"

/**
 * ActivityRecordResponse.
 */
type ActivityRecordResponse = ActivityRecord

const supportedMethods = ['GET', 'POST']

/**
 * requestHandler
 *
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
export default async function requestHandler(req: NextApiRequest, res: NextApiResponse<ActivityRecordResponse|ApiErrorResponse>) {
  const date = req.query.date

  console.log("request.nextUrl.pathname", req.method)

  if (supportedMethods.includes(req.method)) {
    try {
      const sessionHandler = SessionHandler.create()
      const sessionToken   = SessionHandler.sessionTokenGet(req.headers.cookie)
      const claim          = await sessionHandler.tokenVerify(sessionToken)
      const db             = await DatabaseConnection()
      const handler        = await ActivityHandler.create(db)

      if (req.method === 'GET') {
        await handleGetRequest(claim, handler, req, res)
      }
      else if (req.method === 'POST') {
        await handlePostRequest(claim, handler,req, res)
      }
    }
    catch (error: any) {
      handleErrorResponse(error, date, res)
    }
  }
  else {
    res.status(404)
      .json({
        message: "Route not found"
      })
  }
}

/**
 * Handle the error response.
 *
 * @param {any} error
 *   The generated error.
 * @param {string} date
 *   The date.
 * @param {NextApiResponse} response
 *   The response that was given.
 */
const handleErrorResponse = (error: any, date, response: NextApiResponse<ActivityRecordResponse|ApiErrorResponse>) => {
  if (error instanceof ErrorResponse) {
    if (error.responseCodeGet() === 404) {
      response.status(200).json({
        activity_date  : date.toString(),
        activity_values: {}
      })
    }
    else {
      response.status(error.responseCodeGet()).json({ message: error.message})
    }
  }
  else {
    response.status(500).json({ message: error.message})
  }
}

/**
 * Handle any GET requests that have been made.
 *
 * @param {Claim} claim
 *   The session claim.
 * @param {ActivityHandler} handler
 *   An instantiated activity handler object.
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
const handleGetRequest = async (claim: Claim, handler: ActivityHandler, req: NextApiRequest, res: NextApiResponse<ActivityRecordResponse|ApiErrorResponse>) => {
  const date = req.query.date

  try {
    const activity = await handler.activityGetForUserByDate(claim.userId, date.toString())
    res.status(200).json({
      userId: activity.userId,
      activity_date  : activity.activity_date,
      activity_values: activity.activity_values
    })
  }
  catch (error: any) {
    handleErrorResponse(error, date, res)
  }
}

/**
 * Handle any POST requests that have been made.
 *
 * @param {Claim} claim
 *   The session claim.
 * @param {ActivityHandler} handler
 *   An instantiated activity handler object.
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiRequest} req
 *   The request that was made.
 * @param {NextApiResponse} res
 *   The response that was given.
 */
const handlePostRequest = async (claim: Claim, handler: ActivityHandler, req: NextApiRequest, res: NextApiResponse<ActivityRecordResponse|ApiErrorResponse>) => {
  const date = req.query.date
  const body = req.body

  try {
    const record: ActivityRecord = {
      activity_date  : date.toString(),
      userId         : claim.userId,
      activity_values: body.values
    }

    await handler.activityUpsert(record)

    res.status(200).json(record)
  }
  catch (error: any) {
    if (error instanceof ErrorResponse) {
      res.status(error.responseCodeGet()).json({ message: error.message})
    }
    else {
      res.status(500).json({ message: error.message})
    }
  }
}
