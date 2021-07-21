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

	return (
		<TextField
			className={getClassName()}
			fullWidth
			multiline={props.multiline}
			rows={props.rows}
			rowsMax={props.rowsMax}
			margin='dense'
			required={props.required}
			value={props.value}
			onChange={props.onChange}
			label={props.label}
			type={props.label}
			inputProps={{ maxLength: props.maxLength }}
			error={props.errorMessage !== undefined}
			helperText={
				props.errorMessage || `${props.value.length}/${props.maxLength}`
			}
		/>
	)
}
