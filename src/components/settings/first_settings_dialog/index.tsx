import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import SelectTreatment from '../select_treatment'
import DinoSwitch from '../../switch'
import SelectLanguage from '../select_language'
import SelectColorTheme from '../select_color_theme'
import DinoDialog, { DinoDialogHeader } from '../../dialogs/dino_dialog'
import DinoLogoHeader from '../../dino_logo_header'
import DinoStepper from '../../dino_stepper'
import SelectFontSize from '../select_font_size'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import AuthService from '../../../services/auth/AuthService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import TreatmentService from '../../../services/treatment/TreatmentService'
import './styles.css'
import EssentialContactService from '../../../services/contact/EssentialContactService'

const FirstSettingsDialog: React.FC = () => {
	const language = useLanguage()

	const [step, setStep] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])


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
		setStep(-1)
	}

	const saveSettings = async () => {
		if (settings) {
			settings.language = selectedLanguage
			settings.colorTheme = selectedColorTheme
			settings.fontSize = selectedFontSize
			settings.includeEssentialContact = selectedEssentialContactGrant
			settings.declineGoogleContacts = false
			settings.firstSettingsDone = step === NUMBER_DIALOGS - 1
			settings.treatmentLocalId = selectedTreatment?.localId
			settings.step = step

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
		setStep(step - 1)
	}

	const handleNextStep = () => {
		setStep(step + 1)
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
			UserSettingsService.save(settings)
		}
	}


	const handleSelectedTreatmentChange = (
		newSelectedTreatment: TreatmentEntity,
	) => {
		setSelectedTreatment(newSelectedTreatment)

		if (settings && settings.treatmentLocalId !== newSelectedTreatment.id) {
			settings.treatmentLocalId = newSelectedTreatment.localId
			UserSettingsService.save(settings)
		}
	}

	const handleSelectedColorThemeChange = (newColorTheme: number) => {
		setSelectedColorTheme(newColorTheme)

		if (settings && settings.colorTheme !== newColorTheme) {
			settings.colorTheme = newColorTheme
			UserSettingsService.save(settings)
		}
	}

	const handleSelectedLanguageChange = (newLanguage: number) => {
		setSelectedLanguage(newLanguage)

		if (settings && settings.language !== newLanguage) {
			settings.language = newLanguage
			UserSettingsService.save(settings)
		}
	}

	const handleSelectedFontSizeChange = (newFontSize: number) => {
		setSelectedFontSize(newFontSize)

		if (settings && settings.fontSize !== newFontSize) {
			settings.fontSize = newFontSize
			UserSettingsService.save(settings)
		}
	}

	const renderSelectTreatmentDialogContent = () => {
		return (
			<div className='first_settings__message_dialog'>
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
			</div>
		)
	}

	const renderSelectColorThemeDialogContent = () => {
		return (
			<div className='first_settings__message_dialog'>
				<SelectColorTheme
					colorTheme={selectedColorTheme}
					setColorTheme={handleSelectedColorThemeChange}
				/>
			</div>
		)
	}

	const renderSelectLanguageDialogContent = () => {
		return (
			<div className='first_settings__message_dialog'>
				<SelectLanguage
					languageName={selectedLanguage}
					setLanguage={handleSelectedLanguageChange}
				/>
				<SelectFontSize
					fontSize={selectedFontSize}
					setFontSize={handleSelectedFontSizeChange}
				/>
			</div>
		)
	}

	const renderWelcomeMessageDialog = () => {
		return (
			<div className='first_settings__message_dialog'>
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

	const renderFinalMessageDialog = () => {
		return (
			<div className='first_settings__message_dialog'>
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
		{ component: renderWelcomeMessageDialog },
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
		{ component: renderFinalMessageDialog },
	]

	const NUMBER_DIALOGS = firstLoginDialogs.length

	const getDialog = () => {
		if (step < firstLoginDialogs.length) {
			return firstLoginDialogs[step]
		}
		return firstLoginDialogs[firstLoginDialogs.length - 1]
	}

	const renderDialogHeader = () => {

		const isFirstOrLastDialog = step === 0 || step === NUMBER_DIALOGS - 1

		return !isFirstOrLastDialog && <DinoDialogHeader>{getDialog().title}</DinoDialogHeader>
	}

	return (
		<>
			{!isLoading && settings && !settings.firstSettingsDone && (
				<DinoDialog
					aria-labelledby={language.data.FIRST_LOGIN_DIALOG_LABEL}
					open={step > -1}
					handleSave={handleSave}
					handleClose={handleCloseDialogs}
					header={renderDialogHeader()}
					actions={
						<DinoStepper
							steps={NUMBER_DIALOGS}
							activeStep={step}
							onNext={handleNextStep}
							onBack={handleBackStep}
							onSave={handleSave}
							onCancel={handleCancel}
						/>
					}
				>
					{getDialog().component()}
				</DinoDialog>
			)}
		</>
	)
}

export default FirstSettingsDialog
