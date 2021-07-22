import React from 'react'
import { useLanguage } from '../../../context/language'
import './styles.css'

export interface SelectPasswordProps {
	parentsAreaPassword: string
	onChangeConfirmPassword: (event: React.ChangeEvent<HTMLInputElement>) => void
	confirmParentsAreaPassword: string
	onChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void
	passwordErrorMessage?: string
	onPasswordErrorMessageChange: (value?: string) => void
}

export const SelectPassword: React.FC<SelectPasswordProps> = props => {
	const language = useLanguage()

	return (
		<div className='set_password'>
			<p>{language.data.SETTING_PASSWORD_EXPLANATION}</p>
			<form>
				<label htmlFor='pass'>{language.data.INSERT_PASSWORD} </label>
				<input
					autoComplete='off'
					value={props.parentsAreaPassword}
					onChange={props.onChangePassword}
					type='password'
					name='password'
					required
				/>
				<label htmlFor='pass'> {language.data.INSERT_PASSWORD_AGAIN} </label>
				<input
					autoComplete='off'
					value={props.confirmParentsAreaPassword}
					onChange={props.onChangeConfirmPassword}
					type='password'
					name='password'
					required
				/>
				{props.passwordErrorMessage && (
					<p className='set_password__error_message'>
						{props.passwordErrorMessage}
					</p>
				)}
			</form>
		</div>
	)
}
