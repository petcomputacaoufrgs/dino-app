import React from 'react'
import DataConstants from '../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../context/language'
import { DinoTextfield } from '../../textfield'
import { SelectPasswordProps } from './props'
import './styles.css'

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
				/*
				helperText={
					passwordErrorMessage ||
					`${parentsAreaPassword.length - DataConstants.USER_PASSWORD.MIN}/${
						DataConstants.USER_PASSWORD.MAX - DataConstants.USER_PASSWORD.MIN
					}`
				}
				inputProps={{
					maxLength: DataConstants.USER_PASSWORD.MAX,
					endAdornment: (
						<InputAdornment position='end'>
							<DinoIconButton
								ariaLabel={language.data.CONTACT_CLEAR_BUTTON_ARIA_LABEL}
								icon={Visibility}
								className='see_password_button'
								onClick={() => (visible = !visible)}
							/>
						</InputAdornment>
					),
				}}*/
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
