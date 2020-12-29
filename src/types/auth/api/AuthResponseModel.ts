import UserDataModel from '../../user/api/UserModel'

export default interface AuthResponseDataModel {
  accessToken: string
  expiresDate: string
  user: UserDataModel
}
