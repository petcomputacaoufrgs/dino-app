class PathConstants {
	LOGIN = `/`

	RESPONSIBLE = `/responsible`

	RESPONSIBLE_HOME = `${this.RESPONSIBLE}/home`

	STAFF: string = `/staff`

  	HOME: string = `home`

	private GLOSSARY: string = `glossary`

	private CONTACTS: string = `contacts`

	private GAMES: string = `games`

	private SETTINGS: string = `settings`

	private FAQ: string = `faq`

	private NOTES: string = `notes`

	private CALENDAR = `calendar`

	//TODO rename user to responsible

	USER_HOME: string = `${this.RESPONSIBLE}/${this.HOME}`

	USER_GLOSSARY: string = `${this.RESPONSIBLE}/${this.GLOSSARY}`

	USER_CONTACTS: string = `${this.RESPONSIBLE}/${this.CONTACTS}`

	USER_SETTINGS: string = `${this.RESPONSIBLE}/${this.SETTINGS}`

	USER_FAQ: string = `${this.RESPONSIBLE}/${this.FAQ}`

	USER_NOTES: string = `${this.RESPONSIBLE}/${this.NOTES}`

	USER_CALENDAR = `${this.RESPONSIBLE}/${this.CALENDAR}`

	STAFF_HOME: string = `${this.STAFF}/${this.HOME}`

	STAFF_GLOSSARY: string = `${this.STAFF}/${this.GLOSSARY}`
	
	STAFF_CONTACTS: string = `${this.STAFF}/${this.CONTACTS}`

	STAFF_SETTINGS: string = `${this.STAFF}/${this.SETTINGS}`

	STAFF_FAQ: string = `${this.STAFF}/${this.FAQ}`

	STAFF_MODERATION: string = `${this.STAFF}/moderation` 
	
	TREATMENT: string = `${this.STAFF}/treatment` 
	
	KIDS_SPACE = '/kids_space'

	GAME_MENU = `${this.KIDS_SPACE}/game_menu`

	SNAKE_GAME = `${this.GAME_MENU}/snake_game`

	MEMORY_GAME = `${this.GAME_MENU}/memory_game`

	MUSICAL_DINO_GAME = `${this.GAME_MENU}/musical_dino_game`

	DINO_RUNNER_GAME = `${this.GAME_MENU}/dino_runner`

	TIC_TAC_DINO_GAME = `${this.GAME_MENU}/tic_tac_dino`

	DINO_SLIDER_GAME = `${this.GAME_MENU}/dino_slider`

	ABOUT_US = '/about_us'

	TERMS_OF_USE = '/terms_of_use'

	PRIVACY_POLICY = '/privacy_policy'
	
	FAQ_TAB = '0'

	USER_QUESTIONS_TAB = '1'
}

export default new PathConstants()
