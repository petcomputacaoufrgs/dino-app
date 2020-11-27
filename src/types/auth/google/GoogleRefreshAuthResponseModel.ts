export default interface GoogleRefreshAuthResponseModel {
  googleAccessToken: string
  googleExpiresDate: number
  scopeList: string[]
  declinedContatsGrant: boolean
}
