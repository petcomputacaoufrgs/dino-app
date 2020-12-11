import UserModel from '../user/api/UserModel'

export default interface AuthResponseModel {
  accessToken: string
  expiresDate: number
  user: UserModel
}
