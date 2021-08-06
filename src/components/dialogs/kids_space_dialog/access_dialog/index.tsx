import React, { ChangeEvent, useEffect, useState } from 'react'
import { useLanguage } from '../../../../context/language/index'
import { useAlert } from '../../../../context/alert/index'
import Button from '../../../button'
import UserSettingsEntity from '../../../../types/user/database/UserSettingsEntity'
import UserSettingsService from '../../../../services/user/UserSettingsService'
import ResponsibleAuthService from '../../../../services/auth/ResponsibleAuthService'
import UserSettingsConstants from '../../../../constants/auth/ResponsibleAuthConstants'
import HashUtils from '../../../../utils/HashUtils'
import DataConstants from '../../../../constants/app_data/DataConstants'
import AccessDialogProps from './props'
import '../styles.css'
import './styles.css'

const AccessDialog: React.FC<AccessDialogProps> = ({
	open,
  icon: Icon,
  onClose,
  onConfirm,
	onRecoverPassword
}) => {
	const alert = useAlert()
	const language = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettingsEntity | undefined>(undefined)
	const [responsiblePassword, setResponsiblePassword] = useState("")
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()
    
  useEffect(() => {
      if(!open) {
          setResponsiblePassword("")
          setPasswordErrorMessage(undefined)
			}
  }, [open])

  useEffect(() => {
		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			
			if (settings) {
				updateSettings(settings)
			}
			finishLoading()
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			setSettings(settings)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateSettings = () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])


  const handleConfirm = async () => {
    if (!settings) return

		const success = await ResponsibleAuthService.responsibleLogin(responsiblePassword)

		if (success) {
			onConfirm()
		} else {
			setPasswordErrorMessage(language.data.WRONG_PASSWORD)
		}
  }

	const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value
		
		if (newValue.length <= DataConstants.USER_PASSWORD.MAX) {
			setResponsiblePassword(event.target.value)
		}
	}

	const handleRecoverPassword = async () => {
		const success = await ResponsibleAuthService.requestCode()
		if (success) {
			onRecoverPassword()
		} else {
			alert.showErrorAlert(language.data.ERROR_REQUESTING_RECOVER_CODE)
		}
	}

	return (
		<>
		{open &&
        <div className="kids_space_dialog access_dialog">
        <div className="kids_space_dialog__circle">
            <Icon />
        </div>
          <div className='kids_space_dialog__content'>
                <p>{language.data.ACCESS_PARENTS_AREA}</p>
                <div className='access_dialog__form'>
				<form onSubmit={e => e.preventDefault()}>
									<label>{language.data.PASSWORD}</label><br/>
									<input 
										autoComplete="off"
										value={responsiblePassword} 
										onChange={handleChangePassword}
										type="password" 
										required 
									/>
										{passwordErrorMessage && <p className="access_dialog__form__error_message">{passwordErrorMessage}</p>}
									<TextButton onClick={handleRecoverPassword}>
										{language.data.FORGOT_PASSWORD}
									</TextButton>
									<div className='access_dialog__buttons'>
										<Button onClick={onClose}>{language.data.DIALOG_CANCEL_BUTTON_TEXT}</Button>
										<Button type="submit" onClick={handleConfirm}>{language.data.ACCESS_BUTTON}</Button>
									</div>
								</form>
                    <a href={'https://i.guim.co.uk/img/media/936a06656761f35e75cc20c9098df5b2e8c27ba7/0_398_4920_2952/master/4920.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=97df6bd31d4f899da5bf4933a39672da'}> {language.data.FORGOT_PASSWORD}</a>
                    <div className='access_dialog__buttons'>
                        <Button onClick={onClose}>{language.data.CANCEL}</Button>
                        <Button onClick={handleConfirm}>{language.data.ACCESS}</Button>
                    </div>
                </div>
          </div>
        </div>}
		</>
	)
}

export default AccessDialog