import {SessionHandler} from "../src/classes/SessionHandler"
import {wait} from "./setup/helpers"
import {ErrorResponse} from "../src/classes/ErrorResponse"
import {HandlerBase}   from "../src/classes/HandlerBase"

describe("User session actions", () => {

  it("Can create and validate a session token.", async () => {
    const key = "private-key"

    const sessionHandler = new SessionHandler(key)
    const userData       = {userId: "1234", role: "user"}
    const token          = await sessionHandler.tokenCreate(userData)
    const claim          = await sessionHandler.tokenVerify(token)

    expect(claim.payload.userId).toEqual(userData.userId)
    expect(claim.payload.role).toEqual(userData.role)
  })

  it("Cannot claim an expired token.", async () => {
    const key = "private-key"

    const sessionHandler = new SessionHandler(key)
    const userData       = {userId: "1234", role: "user"}
    const token          = await sessionHandler.tokenCreate(userData, "1s")

    await wait(3000)

    try {
      await sessionHandler.tokenVerify(token)
      expect(true).toEqual(false)
    }
    catch (error: any) {
      expect(error).toBeInstanceOf(ErrorResponse)
      expect(error.type).toEqual(HandlerBase.errorResponses.invalidToken.type)
      expect(error.message).toEqual(HandlerBase.errorResponses.invalidToken.label)
    }
  })

  it("Check is a user can perform a protected action.", async () => {
    expect(SessionHandler.canPerformProtectedAction("user")).toEqual(false)
    expect(SessionHandler.canPerformProtectedAction("admin")).toEqual(true)
  })

})