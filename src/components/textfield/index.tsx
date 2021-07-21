import React from 'react'
import TextField from '@material-ui/core/TextField'
import StringUtils from '../../utils/StringUtils'
import { DinoTexfieldProps } from './props'

export const DinoTextfield: React.FC<DinoTexfieldProps> = props => {
	const getClassName = () => {
		const nativeClassName = 'dino__textfield'

		if (StringUtils.isNotEmpty(props.className)) {
			return `${props.className} ${nativeClassName}`
		}

		return nativeClassName
	}

	const getHelperText = () => {
		const formatMaxLength = () => {
			if (props.value && props.dataProps)
				return `${(props.value as string).length}/${props.dataProps.MAX}`
		}

		return props.helperText || props.errorMessage || formatMaxLength()
	}

	return (
		<TextField
			fullWidth
			margin='dense'
			type='text'
			inputProps={props.inputProps || { maxLength: props.dataProps?.MAX }}
			required={props.dataProps?.REQUIRED}
			error={props.error || props.errorMessage !== undefined}
			helperText={getHelperText()}
			{...props}
			className={getClassName()}
		/>
	)
}
