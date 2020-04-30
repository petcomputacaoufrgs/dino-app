import AuthResponseModel from '../settings/AuthResponseModel'

export default interface GoogleAuthResponseModel extends AuthResponseModel {
    googleAccessToken: string
}