import React from 'react'
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField'
import StringUtils from '../../utils/StringUtils'
import { DinoTexfieldProps } from './props'

export const DinoTextfield: React.FC<
	DinoTexfieldProps & StandardTextFieldProps
> = propsAll => {
	const dinoProps = propsAll as DinoTexfieldProps
	const muiProps = propsAll as StandardTextFieldProps

	const getClassName = () => {
		const nativeClassName = 'dino__textfield'

		if (StringUtils.isNotEmpty(muiProps.className)) {
			return `${muiProps.className} ${nativeClassName}`
		}

		return nativeClassName
	}

	const getHelperText = () => {
		const formatMaxLength = () => {
			if (dinoProps.dataProps)
				return `${((muiProps.value as string) || '').length}/${
					dinoProps.dataProps.MAX
				}`
		}

		return muiProps.helperText || dinoProps.errorMessage || formatMaxLength()
	}

	return (
		<TextField
			fullWidth
			margin='dense'
			type='text'
			inputProps={
				muiProps.inputProps || { maxLength: dinoProps.dataProps?.MAX }
			}
			required={dinoProps.dataProps?.REQUIRED}
			error={muiProps.error || dinoProps.errorMessage !== undefined}
			helperText={getHelperText()}
			{...muiProps}
			className={getClassName()}
		/>
	)
}
