import React from 'react'
import DataConstants from '../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../context/language'
import { DinoTextfield } from '../../textfield'
import './styles.css'

export interface SelectPasswordProps {
	oldPassword?: string
	onChangeOldPassword?: (event: React.ChangeEvent<HTMLInputElement>) => void
	parentsAreaPassword: string
	onChangeConfirmPassword: (event: React.ChangeEvent<HTMLInputElement>) => void
	confirmParentsAreaPassword: string
	onChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void
	passwordErrorMessage?: string
	showOldPasswordField?: boolean
}

export const SelectPassword: React.FC<SelectPasswordProps> = props => {
	const language = useLanguage()

	return (
		<div className='set_password'>
			<p>{language.data.SETTING_PASSWORD_EXPLANATION}</p>
			{props.showOldPasswordField && (
				<DinoTextfield
					label={language.data.INSERT_OLD_PASSWORD}
					dataProps={DataConstants.USER_PASSWORD}
					value={props.oldPassword}
					onChange={props.onChangeOldPassword}
					type='password'
					name='password'
					errorMessage={props.passwordErrorMessage}
				/>
			)}
			<DinoTextfield
				label={language.data.INSERT_PASSWORD}
				dataProps={DataConstants.USER_PASSWORD}
				value={props.parentsAreaPassword}
				onChange={props.onChangePassword}
				type='password'
				name='password'
				errorMessage={props.passwordErrorMessage}
			/>
			<DinoTextfield
				label={language.data.INSERT_PASSWORD_AGAIN}
				dataProps={DataConstants.USER_PASSWORD}
				value={props.confirmParentsAreaPassword}
				onChange={props.onChangeConfirmPassword}
				type='password'
				name='password'
				errorMessage={props.passwordErrorMessage}
			/>
		</div>
	)
}
