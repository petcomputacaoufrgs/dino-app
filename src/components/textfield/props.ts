import { StandardTextFieldProps } from '@material-ui/core/TextField'

export interface DinoTexfieldProps extends StandardTextFieldProps {
	maxLength: number
	errorMessage?: string
}
