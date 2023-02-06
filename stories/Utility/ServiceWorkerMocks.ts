import { rest } from "msw"

const randomRangeValueGet = () => {
  return Math.floor(Math.random() * 10)
}

const randomYesNoValueGet = () => {
  return  Math.floor(Math.random() * 10) > 5 ? "Yes" : "No"
}

/**
 * Service worker mock for the activity date for a given date.
 *
 * @returns {RestHandler<import("./handlers/RequestHandler").MockedRequest<DefaultRequestBody>>}
 */
export const swRetrieveActivitiesForDate = (withError = false, timeout: number = 1000) => {
  return rest.get("/api/me/activity/date/:date", (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (withError) {
          resolve(res(ctx.status(500, "An unexpected error occurred")))
        }
        else {
          resolve(
            res(ctx.json({
              activity_date  : req.params.date,
              activity_values: {
                sleep_value     : randomRangeValueGet(),
                sleep_quality   : randomRangeValueGet(),
                exercise_value  : randomYesNoValueGet(),
                exercise_quality: randomRangeValueGet(),
                sitting_value   : randomRangeValueGet(),
                sitting_quality : randomRangeValueGet(),
                steps_value     : randomRangeValueGet(),
                steps_quality   : randomRangeValueGet()
              }
            }))
          )
        }
      }, timeout)
    })
  })
}

/**
 * Service worker mock for the activity date for a given date.
 *
 * @returns {RestHandler<import("./handlers/RequestHandler").MockedRequest<DefaultRequestBody>>}
 */
export const swSaveActivitiesForDate = (withError = false, timeout: number = 1000) => {
  return rest.post("/api/me/activity/date/:date", (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (withError) {
          resolve(res(ctx.status(500, "An unexpected error occurred")))
        }
        else {
          resolve(res(ctx.json({})))
        }
      }, timeout)
    })
  })
}

/**
 * Service worker mock for the activity date for a given date.
 *
 * @returns {RestHandler<import("./handlers/RequestHandler").MockedRequest<DefaultRequestBody>>}
 */
export const swUserSessionCreate = (withError = null, timeout: number = 1000) => {
  return rest.post("api/user/session-create", (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (withError) {
          // resolve(res(ctx.status(500, "An unexpected error occurred")))
          resolve(res(ctx.status(withError, "An unexpected error occurred")))
        }
        else {
          resolve(res(ctx.json({sessionId: "session_id"})))
        }
      }, timeout)
    })
  })
}

/**
 * Service worker mock for the activity date for a given date.
 *
 * @returns {RestHandler<import("./handlers/RequestHandler").MockedRequest<DefaultRequestBody>>}
 */
export const swUserRegister = (withError = null, timeout: number = 1000) => {
  return rest.post("api/user/register", (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (withError) {
          resolve(res(ctx.status(500, "An unexpected error occurred")))
        }
        else {
          resolve(res(ctx.json({sessionId: "session_id"})))
        }
      }, timeout)
    })
  })
}

/**
 * Service worker mock for the activity date for a given date.
 *
 * @returns {RestHandler<import("./handlers/RequestHandler").MockedRequest<DefaultRequestBody>>}
 */
export const swUserPasswordReset = (withError = null, timeout: number = 1000) => {
  return rest.post("api/user/password-reset", (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (withError) {
          resolve(res(ctx.status(500, "An unexpected error occurred")))
        }
        else {
          resolve(res(ctx.json({sessionId: "session_id"})))
        }
      }, timeout)
    })
  })
}

/**
 * Service worker mock for the activity date for a given date.
 *
 * @returns {RestHandler<import("./handlers/RequestHandler").MockedRequest<DefaultRequestBody>>}
 */
export const swUserUpdate = (withError = null, timeout: number = 1000) => {
  return rest.post("api/me/update", (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (withError) {
          resolve(res(ctx.status(500, "An unexpected error occurred")))
        }
        else {
          resolve(res(ctx.json({sessionId: "session_id"})))
        }
      }, timeout)
    })
  })
}

/**
 * Service worker mock for the activity date for a given date.
 *
 * @returns {RestHandler<import("./handlers/RequestHandler").MockedRequest<DefaultRequestBody>>}
 */
export const swUserVerify = (withError = null, timeout: number = 1000) => {
  return rest.post("api/me/verify", (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (withError) {
          resolve(res(ctx.status(500, "An unexpected error occurred")))
        }
        else {
          resolve(res(ctx.json({sessionId: "session_id"})))
        }
      }, timeout)
    })
  })
}