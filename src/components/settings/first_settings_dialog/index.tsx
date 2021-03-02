import React, { ChangeEvent, useEffect, useState } from 'react'
import { Dialog, DialogActions } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import SelectTreatment from '../select_treatment'
import DinoSwitch from '../../switch'
import SelectLanguage from '../select_language'
import SelectColorTheme from '../select_color_theme'
import DinoDialogHeader, { DinoDialogContent } from '../../dino_dialog'
import DinoLogoHeader from '../../dino_logo_header'
import DinoStepper from '../../dino_stepper'
import SelectFontSize from '../select_font_size'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import AuthService from '../../../services/auth/AuthService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TransitionSlide from '../../slide_transition'
import UserSettingsService from '../../../services/user/UserSettingsService'
import TreatmentService from '../../../services/treatment/TreatmentService'
import EssentialContactService from '../../../services/contact/EssentialContactService'
import UserSettingsConstants from '../../../constants/user/UserSettingsConstants'
import './styles.css'

const FirstSettingsDialog: React.FC = () => {
	const language = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])
	const [dialogOpen, setDialogOpen] = useState(true)
	const [selectedLanguage, setSelectedLanguage] = useState(
		language.data.LANGUAGE_CODE,
	)
	const [selectedTreatment, setSelectedTreatment] = useState<
		TreatmentEntity | undefined
	>(undefined)
	const [selectedFontSize, setSelectedFontSize] = useState(
		UserSettingsService.getDefaultFontSizeCode(),
	)
	const [selectedColorTheme, setSelectedColorTheme] = useState(
		UserSettingsService.getDefaultColorThemeCode(),
	)
	const [
		selectedEssentialContactGrant,
		setSelectedEssentialContactGrant,
	] = useState(UserSettingsService.getDefaultEssentialContactGrant())
	const [parentsAreaPassword, setParentsAreaPassword] = useState<string>("")
	const [confirmParentsAreaPassword, setConfirmParentsAreaPassword] = useState<string>("")
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			const settings = await UserSettingsService.getFirst()

			if (settings) {
				const treatment = treatments.find(
					treatment => treatment.localId === settings.treatmentLocalId,
				)
				if (treatment) {
					updateSelectedTreatment(treatment)
				}
				updateSettings(settings)
			}

			updateTreatments(treatments)

			finishLoading()
		}

		let updateSelectedTreatment = (treatment: TreatmentEntity) => {
			setSelectedTreatment(treatment)
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			const colorThemeCode = UserSettingsService.getColorThemeCode(settings)
			const fontSizeCode = UserSettingsService.getFontSizeCode(settings)
			const essentialContactGrant = UserSettingsService.getEssentialContactGrant(
				settings,
			)
			setSelectedColorTheme(colorThemeCode)
			setSelectedFontSize(fontSizeCode)
			setSelectedEssentialContactGrant(essentialContactGrant || false)
			setSettings(settings)
		}

		let updateTreatments = (treatments: TreatmentEntity[]) => {
			setTreatments(treatments)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)
		TreatmentService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateSelectedTreatment = () => {}
			updateSettings = () => {}
			updateTreatments = () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	useEffect(() => {
		setSelectedLanguage(language.data.LANGUAGE_CODE)
	}, [language])

	const handleCloseDialogs = () => {
		setDialogOpen(false)
	}

	const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value
		
		if (newValue.length <= UserSettingsConstants.PASSWORD_MAX) {
			setParentsAreaPassword(event.target.value)
		}
	}

	const handleChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value

		if (newValue.length <= UserSettingsConstants.PASSWORD_MAX) {
			setConfirmParentsAreaPassword(event.target.value)
		}
	}

	const saveSettings = async () => {
		if (settings) {
			settings.language = selectedLanguage
			settings.colorTheme = selectedColorTheme
			settings.fontSize = selectedFontSize
			settings.includeEssentialContact = selectedEssentialContactGrant
			settings.declineGoogleContacts = false
			settings.firstSettingsDone = true
			settings.treatmentLocalId = selectedTreatment?.localId
			settings.parentsAreaPassword = parentsAreaPassword

			await UserSettingsService.save(settings)

			if (settings.includeEssentialContact) {
				EssentialContactService.saveUserEssentialContacts(settings)
			}
		}
	}

	const handleSave = () => {
		handleCloseDialogs()
		saveSettings()
	}

	const handleCancel = () => {
		handleCloseDialogs()
		AuthService.logout()
	}

	const handleBackStep = () => {
		if (settings) {
			settings.settingsStep -= 1

			UserSettingsService.save(settings)
		}
	}

	const handleNextStep = () => {
		if (settings) {
			if (isInvalidPassword(settings)) return
			settings.settingsStep += 1
			UserSettingsService.save(settings)
		} else if (selectedLanguage && selectedFontSize && selectedColorTheme) {
			const newEntity: UserSettingsEntity = {
				language: selectedLanguage,
				fontSize: selectedFontSize,
				colorTheme: selectedColorTheme,
				includeEssentialContact: true,
				declineGoogleContacts: false,
				firstSettingsDone: false,
				settingsStep: 1,
			}

			UserSettingsService.save(newEntity)
		}
	}

	const handleEssentialContactGrantChange = (
		includeEssentialContact: boolean,
	) => {
		setSelectedEssentialContactGrant(includeEssentialContact)

		if (
			settings &&
			settings.includeEssentialContact !== includeEssentialContact
		) {
			settings.includeEssentialContact = includeEssentialContact
			UserSettingsService.saveOnlyLocally(settings)
		}
	}

	const handleSelectedTreatmentChange = (
		newSelectedTreatment: TreatmentEntity,
	) => {
		setSelectedTreatment(newSelectedTreatment)

		if (settings && settings.treatmentLocalId !== newSelectedTreatment.id) {
			settings.treatmentLocalId = newSelectedTreatment.localId
			UserSettingsService.saveOnlyLocally(settings)
		}
	}

	const handleSelectedColorThemeChange = (newColorTheme: number) => {
		setSelectedColorTheme(newColorTheme)

		if (settings && settings.colorTheme !== newColorTheme) {
			settings.colorTheme = newColorTheme
			UserSettingsService.saveOnlyLocally(settings)
		}
	}

	const handleSelectedLanguageChange = (newLanguage: number) => {
		setSelectedLanguage(newLanguage)

		if (settings && settings.language !== newLanguage) {
			settings.language = newLanguage
			UserSettingsService.saveOnlyLocally(settings)
		}
	}

	const handleSelectedFontSizeChange = (newFontSize: number) => {
		setSelectedFontSize(newFontSize)

		if (settings && settings.fontSize !== newFontSize) {
			settings.fontSize = newFontSize
			UserSettingsService.saveOnlyLocally(settings)
		}
	}

	const isInvalidPassword = (settings: UserSettingsEntity): boolean => {
		if (settings.settingsStep !== 4) return false

		if (parentsAreaPassword.length < UserSettingsConstants.PASSWORD_MIN) {
			setPasswordErrorMessage(language.data.PASSWORD_MIN_LENGHT_ERROR_MESSAGE)
			return true
		}

		if (parentsAreaPassword !== confirmParentsAreaPassword) {
			setPasswordErrorMessage(language.data.PASSWORD_CONFIRM_LENGHT_ERROR_MESSAGE)
			return true
		}

		return false
	}

	const renderSelectTreatmentDialogContent = () => {
		return (
			<SelectTreatment
				treatment={selectedTreatment}
				setTreatment={handleSelectedTreatmentChange}
				availableTreatments={treatments}
			>
				<DinoSwitch
					selected={selectedEssentialContactGrant}
					setSelected={handleEssentialContactGrantChange}
					label={language.data.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
				/>
			</SelectTreatment>
		)
	}

	const renderSelectColorThemeDialogContent = () => {
		return (
			<SelectColorTheme
				colorTheme={selectedColorTheme}
				setColorTheme={handleSelectedColorThemeChange}
			/>
		)
	}

	const renderSelectLanguageDialogContent = () => {
		return (
			<>
				<SelectLanguage
					languageName={selectedLanguage}
					setLanguage={handleSelectedLanguageChange}
				/>
				<SelectFontSize
					fontSize={selectedFontSize}
					setFontSize={handleSelectedFontSizeChange}
				/>
			</>
		)
	}

	const renderWelcomeMessageDialog = () => {
		return (
			<div className='message_dialog'>
				<DinoLogoHeader
					title={language.data.FIRST_LOGIN_WELCOME_MESSAGE}
					size='small'
				/>
				<p>
					Mensagem do Dino Lorem ipsum dolor sit amet consectetur adipisicing
					elit. Nisi illum officiis vero debitis quia nam iusto. Necessitatibus
					repudiandae ut labore!
				</p>
				<h6 className='citation'>— {language.data.DINOAPP_TEAM}</h6>
			</div>
		)
	}

	const renderSetPasswordDialog = () => {
		return (
			<div className='message_dialog set_password'>
				<p>
					{language.data.SETTING_PASSWORD_EXPLANATION}
				</p>
				<form>
					<label htmlFor="pass">{language.data.INSERT_PASSWORD} </label>
					<input 
						autoComplete="off" 
						value={parentsAreaPassword} 
						onChange={handleChangePassword}
						type="password" 
						name="password" 
						required />
					<label htmlFor="pass"> {language.data.INSERT_PASSWORD_AGAIN} </label>
					<input 
						autoComplete="off" 
						value={confirmParentsAreaPassword}
						onChange={handleChangeConfirmPassword}
						type="password" 
						name="password" 
						required />
					{passwordErrorMessage && <p className="set_password__error_message">{passwordErrorMessage}</p>}
				</form>
			</div>
		)
	}

	const renderFinalMessageDialog = () => {
		return (
			<div className='message_dialog'>
				<DinoLogoHeader
					title={language.data.FIRST_LOGIN_DONE_MESSAGE}
					size='small'
				/>
				<p>Obrigado por se juntar ao DinoApp!</p>
				<p>
					Suas configurações podem ser atualizadas a qualquer momento na aba de{' '}
					<em>Configurações</em>
				</p>
			</div>
		)
	}

	const firstLoginDialogs = [
		{ title: '', component: renderWelcomeMessageDialog },
		{
			title: language.data.FIRST_LOGIN_CHOOSE_LANGUAGE,
			component: renderSelectLanguageDialogContent,
		},
		{
			title: language.data.FIRST_LOGIN_CHOOSE_COLOR_THEME,
			component: renderSelectColorThemeDialogContent,
		},
		{
			title: language.data.FIRST_LOGIN_CHOOSE_TREATMENT,
			component: renderSelectTreatmentDialogContent,
		},
		{
			title: 'Crie uma senha para a área dos responsáveis', 
			component: renderSetPasswordDialog,
		},
		{ title: '', component: renderFinalMessageDialog },
	]

	const NUMBER_DIALOGS = firstLoginDialogs.length

	const isFirstOrLastDialog = (index: number) =>
		index === 0 || index === NUMBER_DIALOGS - 1

	const getDialog = (step: number) => {
		if (step < firstLoginDialogs.length) {
			return firstLoginDialogs[step]
		}
		return firstLoginDialogs[firstLoginDialogs.length - 1]
	}

	const renderDialogContent = () => {
		const step = settings ? settings.settingsStep : 0
		const dialog = getDialog(step)

		return (
			<>
				{isFirstOrLastDialog(step) ? (
					<></>
				) : (
					<DinoDialogHeader>
						<h5>{dialog.title}</h5>
					</DinoDialogHeader>
				)}
				<DinoDialogContent>{dialog.component()}</DinoDialogContent>
			</>
		)
	}

	return (
		<>
			{!isLoading && settings && !settings.firstSettingsDone && (
				<div className='first_settings'>
					<Dialog
						className='first_settings__dialog'
						aria-labelledby={language.data.FIRST_LOGIN_DIALOG_LABEL}
						open={dialogOpen}
						TransitionComponent={TransitionSlide}
						disableEscapeKeyDown
						disableBackdropClick
						fullWidth
					>
						{renderDialogContent()}
						<DialogActions>
							<DinoStepper
								steps={NUMBER_DIALOGS}
								activeStep={settings ? settings.settingsStep : 0}
								endMessage={language.data.DIALOG_SAVE_BUTTON_TEXT}
								onNext={handleNextStep}
								onBack={handleBackStep}
								onEnd={handleSave}
								onCancel={handleCancel}
							/>
						</DialogActions>
					</Dialog>
				</div>
			)}
		</>
	)
}

export default FirstSettingsDialog
