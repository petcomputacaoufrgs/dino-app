import { StandardTextFieldProps } from '@material-ui/core/TextField'
import { DataConstantProps } from '../../constants/app_data/DataConstants'

export interface DinoTexfieldProps extends StandardTextFieldProps {
	dataProps?: DataConstantProps
	errorMessage?: string
}
