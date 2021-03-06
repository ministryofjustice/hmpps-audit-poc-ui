export default {}

export type RequestData = 'basicDetails' | 'sentences' | 'offences' | 'offenderManagers'
export interface PrisonerSearchForm {
  lastName?: string
  prisonerNumber?: string
  data?: Array<RequestData>
}
declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    prisonerSearchForm: PrisonerSearchForm
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      flash(type: string, message: Array<Record<string, string>>): number
      flash(message: 'errors'): Array<Record<string, string>>
    }
  }
}
