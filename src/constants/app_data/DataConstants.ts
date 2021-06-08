class DataConstants {

	// *-------------* CONTACT *-------------*
	
	static CONTACT_NAME = { MAX : 100, REQUIRED: true } as const
	static CONTACT_DESCRIPTION = { MAX : 500, REQUIRED: false } as const
	static CONTACT_PHONE_NUMBER = { MAX : 30, REQUIRED: false } as const
	
	static CONTACT_PHONE_CODE_PUBLIC_SERVICE = 1 as const
	static CONTACT_PHONE_CODE_RESIDENTIAL = 2 as const
	static CONTACT_PHONE_CODE_MOBILE = 8 as const

	// *-------------* TREATMENT *-------------*

	static TREATMENT = { MAX : 100, REQUIRED: true } as const

	// *-------------* FAQ *-------------*

	static FAQ_QUESTION = { MAX : 30, REQUIRED: true } as const
	static FAQ_ANSWER = { MAX : 1000, REQUIRED: true } as const
	static FAQ_USER_QUESTION = { MAX : 200, REQUIRED: true } as const

	// *-------------* GLOSSARY *-------------*
	
	static GLOSSARY_TITLE = { MAX : 50, REQUIRED: true } as const
	static GLOSSARY_SUBTITLE = { MAX : 20, REQUIRED: false } as const
	static GLOSSARY_TEXT = { MAX : 1000, REQUIRED: false } as const
	static GLOSSARY_FULLTEXT = { MAX : 10000, REQUIRED: false } as const
	
	// *-------------* STAFF *-------------*
	
	static STAFF_EMAIL = { MAX : 100, REQUIRED: true } as const
	
	// *-------------* USER *-------------*

	static USER_PASSWORD = { MAX : 24, MIN: 8, REQUIRED: true } as const
}

export default DataConstants
