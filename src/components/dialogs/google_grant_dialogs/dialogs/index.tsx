import React from 'react'
import GoogleGrantDialog from '..'
import { useLanguage } from '../../../../context/language'
import UserSettingsService from '../../../../services/user/UserSettingsService'
import GoogleScope from '../../../../types/auth/google/GoogleScope'
import UserSettingsEntity from '../../../../types/user/database/UserSettingsEntity'
import { DinoDialogContent } from '../../dino_dialog'

interface GoogleContactGrantProps {
	settings?: UserSettingsEntity
	onClose: () => void
	open: boolean
}

export const GoogleContactGrantDialog = (props: GoogleContactGrantProps) => {
	const language = useLanguage()

	const handleSaveDecline = (decline: boolean) => {
		if (props.settings) {
			props.settings.declineGoogleContacts = decline
			UserSettingsService.save(props.settings)
		}
		props.onClose()
	}

	return (
		<GoogleGrantDialog
			{...props}
			onAgree={() => handleSaveDecline(false)}
			onDisagree={() => handleSaveDecline(true)}
			scopes={[GoogleScope.CONTACT_SCOPE]}
		>
			<DinoDialogContent>
				<p>{language.data.GOOGLE_CONTACT_GRANT_TEXT}</p>
			</DinoDialogContent>
		</GoogleGrantDialog>
	)
}

export const GoogleCalendarGrantDialog = (props: GoogleContactGrantProps) => {
	const language = useLanguage()

	const handleSaveDecline = (decline: boolean) => {
		if (props.settings) {
			props.settings.declineGoogleCalendar = decline
			UserSettingsService.save(props.settings)
		}
		props.onClose()
	}

	return (
		<GoogleGrantDialog
			{...props}
			onAgree={() => handleSaveDecline(false)}
			onDisagree={() => handleSaveDecline(true)}
			scopes={[GoogleScope.CALENDAR_SCOPE]}
		>
			<DinoDialogContent>
				<p>
					Caledario texto aaaaa \Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Fugit, natus iste,
				</p>
			</DinoDialogContent>
		</GoogleGrantDialog>
	)
}
