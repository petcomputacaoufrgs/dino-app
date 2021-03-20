class PathConstants {
	LOGIN = `/`

	RESPONSIBLE = `/responsible`

	RESPONSIBLE_HOME = `${this.RESPONSIBLE}/home`

	GLOSSARY = `${this.RESPONSIBLE}/glossary`

	CONTACTS = `${this.RESPONSIBLE}/contacts`

	SETTINGS = `${this.RESPONSIBLE}/settings`

	FAQ = `${this.RESPONSIBLE}/faq`

	NOTES = `${this.RESPONSIBLE}/notes`

	CALENDAR = `${this.RESPONSIBLE}/calendar`

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
