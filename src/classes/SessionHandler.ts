import {SignJWT, jwtVerify }  from 'jose'
import {ErrorResponse}        from "./ErrorResponse"
import {UserRoleType}         from "../types/UserRecord"
import {cookieGet, cookieSet} from "@root/src/utility/Cookie";
import {Claim}                from "@root/src/types/Claim";

/**
 * SessionHandler.
 */
export class SessionHandler {

  /**
   * The private key.
   *
   * @type {string}
   */
  key: string

  /**
   * Object constructor
   *
   * @param {string} key
   *   The private key to use.
   */
  constructor(key: string) {
    this.key = key
  }

  /**
   * Create factory.
   */
  static create() {
    return new SessionHandler(process.env.PRIVATE_KEY)
  }

  /**
   * Check to see if the use can perform a protected action.
   *
   * @param {UserRoleType} role
   *   The role to check.
   */
  static canPerformProtectedAction(role: UserRoleType): boolean {
    return role === "admin"
  }

  /**
   * Get the session token from the cookies.
   *
   * @param {string} cookie
   *   The cookie string
   */
  static sessionTokenGet(cookie) {
    return cookieGet("session", cookie)
  }

  /**
   * Destroy the active session.
   */
  sessionDestroy() {
    return cookieSet("session", "")
  }

  /**
   * Create a session token.
   *
   * @param {Claim} claim
   *   The claim data.
   * @param {string} expires
   *   A string indicating when the token should expire - primarily used for testing
   */
  tokenCreate(claim: Claim, expires = "30d") {
   return new SignJWT(claim)
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime(expires)
      .sign(new TextEncoder().encode(this.key))
  }

  /**
   * Verify the given token.
   *
   * @param {string} token
   *   The token to verify.
   *
   * @return Promise<Claim>
   */
  async tokenVerify(token: string): Promise<Claim> {
    try {
      const payload = await jwtVerify(token, new TextEncoder().encode(this.key))
      return {
        userId     : payload.payload.userId as string,
        role       : payload.payload.role ? payload.payload.role as UserRoleType : "user",
        isTemporary: payload.payload.isTemporary as boolean,
      }
    } catch(err: any) {
      throw ErrorResponse.generateErrorResponse(
      "unauthorised",
      "session_handler",
      "Invalid token",
      err.message
      )
    }
  }
}