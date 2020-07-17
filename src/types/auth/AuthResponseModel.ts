import UserModel from '../user/UserModel'

export default interface AuthResponseModel {
  accessToken: string
  user: UserModel
}
