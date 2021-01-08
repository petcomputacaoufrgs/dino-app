import AuthResponseDataModel from "../../api/AuthResponseModel"
import GoogleScopeDataModel from "./GoogleScopeDataModel"
import UserSettingsDataModel from '../../../user/api/UserSettingsDataModel'

export default interface GoogleAuthResponseDataModel extends AuthResponseDataModel {
    googleAccessToken: string
    googleExpiresDate: string
    scopes: GoogleScopeDataModel[]
    refreshToken: string
    settings: UserSettingsDataModel
}