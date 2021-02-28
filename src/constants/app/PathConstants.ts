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

	SNAKE_GAME = `${this.GAME_MENU}/snake_game`

	MEMORY_GAME = `${this.GAME_MENU}/memory_game`

	MUSICAL_DINO_GAME = `${this.GAME_MENU}/musical_dino_game`

	DINO_RUNNER_GAME = `${this.GAME_MENU}/dino_runner`
	TIC_TAC_DINO_GAME = `${this.GAME_MENU}/tic_tac_dino`

	ABOUT_US = '/about_us'

	TERMS_OF_USE = '/terms_of_use'

	PRIVACY_POLICY = '/privacy_policy'
}

export default new PathConstants()
