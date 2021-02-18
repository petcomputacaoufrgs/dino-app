import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import SelectFontSizeProps from './props'
import { useLanguage } from '../../../context/language'
import UserSettingsService from '../../../services/user/UserSettingsService'
import './styles.css'

const SelectFontSize: React.FC<SelectFontSizeProps> = ({
	fontSize, 
	setFontSize 
}) => {
	const language = useLanguage()
	const fontSizeList = UserSettingsService.getFontSizeOptions(language.data)

	const handleSelectedFontSizeChanged = (event: any) => {
		if (event && event.target && event.target.value) {
			setFontSize(event.target.value as number)
		}
	}

	return (
		<div className='font_size__selector'>
			<InputLabel shrink id='font_size__select_label'>
				{language.data.FONT_SIZE_SELECTION_TITLE}
			</InputLabel>
			<Select
				labelId='font_size__select_label'
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
