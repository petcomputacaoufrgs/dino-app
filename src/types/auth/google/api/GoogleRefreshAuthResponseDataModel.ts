import GoogleScopeDataModel from './GoogleScopeDataModel'

export default interface GoogleRefreshAuthResponseDataModel {
	googleAccessToken: string
	googleExpiresDate: string
	scopes: GoogleScopeDataModel[]
}
