import AuthResponseDataModel from "../../api/AuthResponseModel";
import GoogleScopeDataModel from "./GoogleScopeDataModel"

export default interface GoogleAuthResponseDataModel extends AuthResponseDataModel {
    googleAccessToken: string
    googleExpiresDate: string
    scopes: GoogleScopeDataModel[]
    refreshToken: string
}