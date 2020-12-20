import UserDataModel from '../user/api/UserModel'

export default interface AuthResponseModel {
  accessToken: string
  expiresDate: number
  user: UserDataModel
}
