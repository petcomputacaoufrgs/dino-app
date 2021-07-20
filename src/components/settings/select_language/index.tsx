import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import SelectLanguageProps from './props'
import { useLanguage } from '../../../context/language'
import UserSettingsService from '../../../services/user/UserSettingsService'

const SelectLanguage: React.FC<SelectLanguageProps> = ({
	languageName,
	setLanguage 
}) => {
	const language = useLanguage()
	const languageOptions = UserSettingsService.getLanguagesOptions(language.data)

	const handleSelectedLanguageChanged = (event: any) => {
		if (event && event.target && event.target.value) {
			setLanguage(event.target.value as number)
		}
	}

	return (
		<>
			<InputLabel shrink id='language_select_label'>
				{language.data.CHOOSE_LANGUAGE}
			</InputLabel>
			<Select
				labelId='language_select_label'
				value={languageName}
				onChange={handleSelectedLanguageChanged}
				fullWidth
			>
				{languageOptions.map((languageOption, index) => (
					<MenuItem key={index} value={languageOption.code}>
						{languageOption.name}
					</MenuItem>
				))}
			</Select>
		</>
	)
}

export default SelectLanguage
