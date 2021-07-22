import React, { ChangeEvent, useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import AuthService from '../../../services/auth/AuthService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import TreatmentService from '../../../services/treatment/TreatmentService'
import EssentialContactService from '../../../services/contact/EssentialContactService'
import './styles.css'
import HashUtils from '../../../utils/HashUtils'
import FirstSettingsDialog from './dialogs'
import DataConstants from '../../../constants/app_data/DataConstants'
import { toggle } from '../../../constants/toggle/Toggle'

const FirstSettings: React.FC = () => {
	let done = false
	const language = useLanguage()

	const [step, setStep] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])
	const [parentsAreaPassword, setParentsAreaPassword] = useState('')
	const [confirmParentsAreaPassword, setConfirmParentsAreaPassword] =
		useState('')
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			const settings = await UserSettingsService.getFirst()

			if (settings) {
				setSettings(settings)
			}

			updateTreatments(treatments)

			finishLoading()
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
			updateTreatments = () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleCloseDialogs = () => setStep(-1)

	const saveSettings = async () => {
		if (settings) {
			settings.declineGoogleContacts = false
			settings.firstSettingsDone = done
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
			if (step === settings.step) saveSettings()
			setStep(step + 1)
		} else {
			const newEntity: UserSettingsEntity = {
				language: language.data.LANGUAGE_CODE,
				fontSize: UserSettingsService.getDefaultFontSizeCode(),
				colorTheme: UserSettingsService.getDefaultColorThemeCode(),
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

		if (newValue.length <= DataConstants.USER_PASSWORD.MAX) {
			setParentsAreaPassword(event.target.value)
		}
	}

	const handleConfirmPasswordChange = (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const newValue = event.target.value

		if (newValue.length <= DataConstants.USER_PASSWORD.MAX) {
			setConfirmParentsAreaPassword(event.target.value)
		}
	}

	const handlePasswordErrorMessageChange = (value?: string) => {
		setPasswordErrorMessage(value)
	}

	const handleDoneChange = (value: boolean) => (done = value)

	return (
		<>
			{!isLoading &&
				settings &&
				(!settings.firstSettingsDone || toggle.firstLogin) && (
					<FirstSettingsDialog
						settings={settings}
						step={step}
						onCloseDialogs={handleCloseDialogs}
						onNextStep={handleNextStep}
						onBackStep={handleBackStep}
						onSave={handleSave}
						onCancel={handleCancel}
						treatments={treatments}
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
