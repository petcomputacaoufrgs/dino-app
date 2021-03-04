import React, { ChangeEvent, useEffect, useState } from 'react'
import AccessDialogProps from './props'
import { useLanguage } from '../../../context/language/index'
import Button from '../../button'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsConstants from '../../../constants/user/UserSettingsConstants'
import HashUtils from '../../../utils/HashUtils'
import TextButton from '../../button/text_button'
import RecoverPasswordService from '../../../services/user/RecoverPasswordService'
import '../styles.css'
import './styles.css'

const AccessDialog: React.FC<AccessDialogProps> = ({
	open,
  icon: Icon,
  onClose,
  onConfirm,
	onRecoverPassword
}) => {
	const language = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettingsEntity | undefined>(undefined)
	const [parentsAreaPassword, setParentsAreaPassword] = useState("")
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()
    
  useEffect(() => {
      if(!open) {
          setParentsAreaPassword("")
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

        const encryptedPassword = await HashUtils.sha256(parentsAreaPassword)
				
        if (settings.parentsAreaPassword !== encryptedPassword) {
          setPasswordErrorMessage(language.data.WRONG_PASSWORD)
        } else {
					onConfirm()
				}
    }

	const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value
		
		if (newValue.length <= UserSettingsConstants.PASSWORD_MAX) {
			setParentsAreaPassword(event.target.value)
		}
	}

	const handleRecoverPassword = async () => {
		RecoverPasswordService.requestCode()
		onRecoverPassword()
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
                    <form>
                        <label>{language.data.PASSWORD}</label><br/>
                        <input 
                            autoComplete="off"
                            value={parentsAreaPassword} 
                            onChange={handleChangePassword}
                            type="password" 
                            name="password" 
                            required />
                        {passwordErrorMessage && <p className="access_dialog__form__error_message">{passwordErrorMessage}</p>}
                    </form>
                    <TextButton onClick={handleRecoverPassword}>
						{language.data.FORGOT_PASSWORD}
					</TextButton>
                    <div className='access_dialog__buttons'>
                        <Button onClick={onClose}>{language.data.DIALOG_CANCEL_BUTTON_TEXT}</Button>
                        <Button onClick={handleConfirm}>{language.data.ACCESS_BUTTON}</Button>
                    </div>
                </div>
          </div>
        </div>}
		</>
	)
}

export default AccessDialog