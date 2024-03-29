import React, { useState, useEffect } from 'react'
import { useAlert } from '../../../context/alert'
import { useLanguage } from '../../../context/language'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import SelectTreatment from '../../../components/settings/select_treatment'
import GoogleGrantDialog from '../../../components/dialogs/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import SelectColorTheme from '../../../components/settings/select_color_theme'
import SelectLanguage from '../../../components/settings/select_language'
import DinoSwitch from '../../../components/switch'
import DinoHr from '../../../components/dino_hr'
import SelectFontSize from '../../../components/settings/select_font_size'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import Loader from '../../../components/loader'
import TreatmentService from '../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import TextButton from '../../../components/button/text_button'
import DinoDialog, {
	DinoDialogContent,
} from '../../../components/dialogs/dino_dialog'
import { DialogActions } from '@material-ui/core'
import UserService from '../../../services/user/UserService'
import AuthService from '../../../services/auth/AuthService'
import './styles.css'
import { HasStaffPowers } from '../../../context/private_router'
import { SelectEssentialContactGrant } from '../../../components/settings/select_essential_contact_grant'

const AWAIT_TIME_TO_DELETE_ACCOUNT_IN_SECONDS = 10

const Settings: React.FC = () => {
	const alert = useAlert()
	const language = useLanguage()
	const isStaff = HasStaffPowers()

	const [openGoogleContactDialog, setOpenGoogleContactDialog] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity | undefined>(
		undefined,
	)
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])
	const [syncGoogleContacts, setSyncGoogleContacts] = useState(false)
	const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false)
	const [timeToDeleteAccount, setTimeToDeleteAccount] = useState(0)

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			const settings = await UserSettingsService.getFirst()
			const syncGoogleContacs = await GoogleScopeService.hasContactGrant()

			if (settings) {
				if (treatments) setTreatments(treatments)
				setSettings(settings)
			}
			updateSyncGoogleContacts(syncGoogleContacs, settings)

			finishLoading()
		}

		let updateSyncGoogleContacts = (
			syncGoogleContacts: boolean,
			settings?: UserSettingsEntity,
		) => {
			if (!settings || settings.declineGoogleContacts) return
			setSyncGoogleContacts(syncGoogleContacts)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)
		TreatmentService.addUpdateEventListenner(loadData)
		GoogleScopeService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateSyncGoogleContacts = () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
			TreatmentService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	useEffect(() => {
		const reduceTimeToDeleteAccount = () =>
			setTimeToDeleteAccount(timeToDeleteAccount - 1)

		let timeout: NodeJS.Timeout

		if (timeToDeleteAccount > 0) {
			timeout = setTimeout(reduceTimeToDeleteAccount, 1000)
		}

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [timeToDeleteAccount])

	const handleGoogleContactSwitchChanged = () => {
		if (!settings) return

		if (!syncGoogleContacts) {
			setOpenGoogleContactDialog(true)
		} else setSyncGoogleContacts(false)
	}

	const handleCloseContactsGrantDialog = () => setOpenGoogleContactDialog(false)

	const handlerDeleteAccountClick = () => {
		setTimeToDeleteAccount(AWAIT_TIME_TO_DELETE_ACCOUNT_IN_SECONDS)
		setOpenDeleteAccountDialog(true)
	}

	const handleCloseDeleteAccountDialog = () => setOpenDeleteAccountDialog(false)

	const handleDeleteAccount = async () => {
		if (timeToDeleteAccount === 0) {
			const success = await UserService.deleteAccount()
			if (success) {
				alert.showSuccessAlert(language.data.DELETE_ACCOUNT_SUCCESS_MESSAGE)
				AuthService.logout()
			} else alert.showErrorAlert(language.data.DELETE_ACCOUNT_ERROR_MESSAGE)
			setOpenDeleteAccountDialog(false)
		}
	}

	const renderDeleteAccountDialog = (): JSX.Element => (
		<DinoDialog
			className='settings__delete_account_dialog'
			onSave={handleDeleteAccount}
			onClose={handleCloseDeleteAccountDialog}
			open={openDeleteAccountDialog}
			header={<h3>{language.data.DELETE_ACCOUNT}</h3>}
			actions={
				<DialogActions>
					<TextButton
						className='settings__delete_account_dialog__buttons'
						onClick={handleCloseDeleteAccountDialog}
					>
						{language.data.NO}
					</TextButton>
					<TextButton
						className='settings__delete_account_dialog__buttons delete_button'
						onClick={handleDeleteAccount}
					>
						{timeToDeleteAccount === 0
							? language.data.YES
							: timeToDeleteAccount}
					</TextButton>
				</DialogActions>
			}
		>
			<Loader isLoading={isLoading}>
				<DinoDialogContent>
					<p>{language.data.DELETE_ACCOUNT_MESSAGE}</p>
				</DinoDialogContent>
			</Loader>
		</DinoDialog>
	)

	const renderUserOnlySection = () =>
		!isStaff && (
			<>
				<FormControl className='settings__form'>
					<SelectTreatment
						availableTreatments={treatments}
						settings={settings}
					/>
				</FormControl>
				<DinoHr invisible />
				<FormControl className='settings__form'>
					<DinoSwitch
						selected={syncGoogleContacts}
						onChangeSelected={handleGoogleContactSwitchChanged}
						label={language.data.SAVE_CONTACT_ON_GOOGLE_GRANT}
					/>
				</FormControl>
				<DinoHr />
				<FormControl className='settings__form'>
					<SelectEssentialContactGrant settings={settings} />
				</FormControl>
			</>
		)

	return (
		<Loader isLoading={isLoading} hideChildren>
			<div className='settings'>
				<Typography
					className='settings__title'
					color='textSecondary'
					gutterBottom
				>
					{language.data.SETTINGS_TITLE}
				</Typography>
				<FormControl className='settings__form'>
					<SelectLanguage settings={settings} />
				</FormControl>
				<FormControl className='settings__form'>
					<SelectFontSize settings={settings} />
				</FormControl>
				<FormControl className='settings__form'>
					<SelectColorTheme settings={settings} />
				</FormControl>
				{renderUserOnlySection()}
				<div style={{ marginTop: '1rem' }} />
				<DinoHr />
				<FormControl>
					<TextButton
						onClick={handlerDeleteAccountClick}
						className='settings__form__delete_account'
					>
						{language.data.DELETE_ACCOUNT}
					</TextButton>
				</FormControl>
				{renderDeleteAccountDialog()}
				{/*TODO ver se isso rola ^*/}
				<GoogleGrantDialog
					settings={settings}
					onClose={handleCloseContactsGrantDialog}
					open={openGoogleContactDialog}
					scopes={[GoogleScope.CONTACT_SCOPE]}
				/>
			</div>
		</Loader>
	)
}

export default Settings
