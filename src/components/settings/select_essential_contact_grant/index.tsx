import React, { useState } from 'react'
import { useLanguage } from '../../../context/language'
import { HasStaffPowers } from '../../../context/private_router'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import DinoSwitch from '../../switch'

export const SelectEssentialContactGrant: React.FC<{
	settings?: UserSettingsEntity
}> = ({ settings }) => {
	const language = useLanguage()
	const isStaff = HasStaffPowers()

	const [selectedEssentialContactGrant, setSelectedEssentialContactGrant] =
		useState(UserSettingsService.getDefaultEssentialContactGrant())

	const handleChange = (includeEssentialContact: boolean) => {
		setSelectedEssentialContactGrant(includeEssentialContact)

		// const oldIncludeEssentialContact = settings.includeEssentialContact

		// 	settings.includeEssentialContact = selectedEssentialContactGrant

		// 	const treatmentChangedWithEssentialContacts =
		// 		oldTreatment !== settings.treatmentLocalId &&
		// 		settings.includeEssentialContact
		// 	const disabledEssentialContacts =
		// 		oldIncludeEssentialContact !== settings.includeEssentialContact &&
		// 		oldIncludeEssentialContact
		// 	const enabledEssentialContacts =
		// 		oldIncludeEssentialContact !== settings.includeEssentialContact &&
		// 		settings.includeEssentialContact

		// 	if (treatmentChangedWithEssentialContacts || disabledEssentialContacts) {
		// 		await ContactService.deleteUserEssentialContacts()
		// 	}

		// 	if (treatmentChangedWithEssentialContacts || enabledEssentialContacts) {
		// 		EssentialContactService.saveUserEssentialContacts(settings)
		// 	}

		if (
			settings &&
			settings.includeEssentialContact !== includeEssentialContact
		) {
			settings.includeEssentialContact = includeEssentialContact
			UserSettingsService.save(settings)
		}
	}

	return !isStaff ? (
		<div>
			<DinoSwitch
				selected={selectedEssentialContactGrant}
				onChangeSelected={() => handleChange(!selectedEssentialContactGrant)}
				label={language.data.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
			/>
		</div>
	) : (
		<></>
	)
}
