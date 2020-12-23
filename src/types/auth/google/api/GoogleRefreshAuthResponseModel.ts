import GoogleScopeDataModel from "./GoogleScopeDataModel"

export default interface GoogleRefreshAuthResponseModel {
  googleAccessToken: string
  googleExpiresDate: number
  scopes: GoogleScopeDataModel[]
  declinedContatsGrant: boolean
}
