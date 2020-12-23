import AuthResponseModel from '../../AuthResponseModel'
import GoogleScopeDataModel from './GoogleScopeDataModel'

export default interface GoogleAuthResponseModel extends AuthResponseModel {
  googleAccessToken: string
  googleExpiresDate: number
  scopes: GoogleScopeDataModel[]
  firstConfigDone: boolean
}
