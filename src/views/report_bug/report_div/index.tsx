import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField'
import React from 'react'
import DinoHr from '../../../components/dino_hr'
import './styles.css'

interface ReportDivProps extends StandardTextFieldProps {
	title: string
	description: string
}

export const ReportDiv: React.FC<ReportDivProps> = props => {
	return (
		<div className='report_div'>
			<h3>{props.title}</h3>
			<DinoHr />
			<p>{props.description}</p>
			<TextField
				className='dino__textfield'
				variant='outlined'
				fullWidth
				rows={10}
				multiline
				{...props}
			/>
		</div>
	)
}
