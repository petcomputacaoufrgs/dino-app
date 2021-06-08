import React, { ChangeEvent, useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import AuthService from '../../../services/auth/AuthService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import TreatmentService from '../../../services/treatment/TreatmentService'
import EssentialContactService from '../../../services/contact/EssentialContactService'
import UserSettingsConstants from '../../../constants/user/UserSettingsConstants'
import './styles.css'
import HashUtils from '../../../utils/HashUtils'
import FirstSettingsDialog from './dialogs'

const FirstSettings: React.FC = () => {

	let done = false
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
	const [parentsAreaPassword, setParentsAreaPassword] = useState("")
	const [confirmParentsAreaPassword, setConfirmParentsAreaPassword] = useState("")
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()

	useEffect(() => {
		setSelectedLanguage(language.data.LANGUAGE_CODE)
	}, [language])

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
			const essentialContactGrant = UserSettingsService.getEssentialContactGrant(settings)

			setSelectedColorTheme(colorThemeCode)
			setSelectedFontSize(fontSizeCode)
			setSelectedEssentialContactGrant(essentialContactGrant || false)
			setSettings(settings)

		}

		let updateTreatments = (treatments: TreatmentEntity[]) => {
			setTreatments(treatments)
		}

		let finishLoading = () => setIsLoading(false)

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

	const handleCloseDialogs = () => setStep(-1)

	const saveSettings = async () => {

		if (settings) {
			settings.language = selectedLanguage
			settings.colorTheme = selectedColorTheme
			settings.fontSize = selectedFontSize
			settings.includeEssentialContact = selectedEssentialContactGrant
			settings.declineGoogleContacts = false
			settings.firstSettingsDone = done
			settings.treatmentLocalId = selectedTreatment?.localId
			settings.parentsAreaPassword = await HashUtils.sha256(parentsAreaPassword)
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
	
	const handleNextStep = async () => {
		if (settings) {
			if (step === settings.step) 
				saveSettings()
			setStep(step + 1)
		} else if (selectedLanguage && selectedFontSize && selectedColorTheme) {
			const newEntity: UserSettingsEntity = {
				language: selectedLanguage,
				fontSize: selectedFontSize,
				colorTheme: selectedColorTheme,
				includeEssentialContact: true,
				declineGoogleContacts: false,
				firstSettingsDone: false,
				step: 0,
			}
	
			setSettings(newEntity)
			saveSettings()
		}
	}
	
	const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value
		
		if (newValue.length <= UserSettingsConstants.PASSWORD_MAX) {
			setParentsAreaPassword(event.target.value)
		}
	}
	
	const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value
	
		if (newValue.length <= UserSettingsConstants.PASSWORD_MAX) {
			setConfirmParentsAreaPassword(event.target.value)
		}
	}

	const handlePasswordErrorMessageChange = (value?: string) => {
		setPasswordErrorMessage(value)
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
	
	const handleDoneChange = (value: boolean) => done = value

	return (
		<>
			{!isLoading && settings && !settings.firstSettingsDone && (
				<FirstSettingsDialog 
					step={step}
					onCloseDialogs={handleCloseDialogs}
					onNextStep={handleNextStep}
					onBackStep={handleBackStep}
					onSave={handleSave}
					onCancel={handleCancel}
					treatments={treatments}
					selectedTreatment={selectedTreatment}
					onSelectedTreatmentChange={handleSelectedTreatmentChange}
					selectedColorTheme={selectedColorTheme}
					onSelectedColorThemeChange={handleSelectedColorThemeChange}
					selectedLanguage={selectedLanguage}
					onSelectedLanguageChange={handleSelectedLanguageChange}
					selectedFontSize={selectedFontSize}
					onSelectedFontSizeChange={handleSelectedFontSizeChange}
					selectedEssentialContactGrant={selectedEssentialContactGrant}
					onEssentialContactGrantChange={handleEssentialContactGrantChange}
					parentsAreaPassword={parentsAreaPassword}
					onChangePassword={handleChangePassword}
					confirmParentsAreaPassword={confirmParentsAreaPassword}
					onChangeConfirmPassword={handleConfirmPasswordChange}
					passwordErrorMessage={passwordErrorMessage}
					onPasswordErrorMessageChange={handlePasswordErrorMessageChange}
					onDoneChange={handleDoneChange}
				/>
			)}
		</>
	)
}

export default FirstSettings
