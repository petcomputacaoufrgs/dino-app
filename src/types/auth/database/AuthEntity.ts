export default interface AuthEntity {
	id?: number
	googleToken?: string
	googleExpiresDate?: Date
	dinoAccessToken: string
	dinoExpiresDate: Date
	dinoRefreshToken: string
	responsibleToken?: string
	responsibleIV?: string
	responsibleCode?: string
}
