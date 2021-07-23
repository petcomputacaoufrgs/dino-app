import React, { useState } from 'react'
import { useLanguage } from '../../../context/language'
import { HasStaffPowers } from '../../../context/private_router'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import DinoSwitch from '../../switch'

/**
 * @see já salva
 */
export const SelectEssentialContactGrant: React.FC<{
	settings?: UserSettingsEntity
}> = ({ settings }) => {
	const language = useLanguage()
	const isStaff = HasStaffPowers()

	const [selectedEssentialContactGrant, setSelectedEssentialContactGrant] =
		useState(UserSettingsService.getEssentialContactGrant(settings))

	const handleChange = (includeEssentialContact: boolean) => {
		setSelectedEssentialContactGrant(includeEssentialContact)

		UserSettingsService.saveSettingsEssentialContactGrant(
			includeEssentialContact,
			settings,
		)
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
