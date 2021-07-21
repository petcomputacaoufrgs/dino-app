export interface DinoTexfieldProps {
	className?: string
	rows?: number
	rowsMax?: number
	multiline?: boolean
	required: boolean
	value: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	label: string
	maxLength: number
	errorMessage?: string
}
