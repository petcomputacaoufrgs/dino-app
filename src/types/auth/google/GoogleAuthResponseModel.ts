import AuthResponseModel from '../AuthResponseModel'

export default interface GoogleAuthResponseModel extends AuthResponseModel {
  googleAccessToken: string
  googleExpiresDate: number
}
