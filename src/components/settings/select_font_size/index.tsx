import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import SelectFontSizeProps from './props'
import { useLanguage } from '../../../context/language'
import UserSettingsService from '../../../services/user/UserSettingsService'

const SelectFontSize = ({ fontSize, setFontSize }: SelectFontSizeProps) => {
	const language = useLanguage()
	const fontSizeList = UserSettingsService.getFontSizeOptions(language.data)

	const handleSelectedFontSizeChanged = (event: any) => {
		if (event && event.target && event.target.value) {
			setFontSize(event.target.value as number)
		}
	}

	return (
		<div className='font-size__selector'>
			<InputLabel shrink id='font-size--select-label'>
				{language.data.FONT_SIZE_SELECTION_TITLE}
			</InputLabel>
			<Select
				labelId='font-size--select-label'
				id='font-size--select'
				value={fontSize}
				onChange={handleSelectedFontSizeChanged}
				fullWidth
			>
				{fontSizeList.map((option, index) => (
					<MenuItem key={index} value={option.code}>
						{option.name}
					</MenuItem>
				))}
			</Select>
		</div>
	)
}

export default SelectFontSize
