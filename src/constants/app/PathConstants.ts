class PathConstants {
	LOGIN: string = `/`

	USER: string = `/user`

	HOME: string = `${this.USER}/home`

	GLOSSARY: string = `${this.USER}/glossary`

	CONTACTS: string = `${this.USER}/contacts`

	GAMES: string = `${this.USER}/games`

	SETTINGS: string = `${this.USER}/settings`

	FAQ: string = `${this.USER}/faq`

	NOTES: string = `${this.USER}/notes`

	CALENDAR = `${this.USER}/calendar`

	KIDS_SPACE = '/kids_space'

	GAME_MENU = `${this.KIDS_SPACE}/game_menu`

	SNAKE_GAME = `${this.KIDS_SPACE}/snake_game`

	ABOUT_US = '/about_us'

	TERMS_OF_USE = '/terms_of_use'

	PRIVACY_POLICY = '/privacy_policy'
}

export default new PathConstants()
