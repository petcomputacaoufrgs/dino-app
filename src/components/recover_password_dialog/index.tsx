import React, { ChangeEvent, useState, useEffect } from 'react'
import RecoverPasswordDialogProps from './props'
import { useLanguage } from '../../context/language/index'
import ApiConfig from '../../environment/api_config.json'
import Button from '../button'
import { Dialog } from '@material-ui/core'
import TransitionSlide from '../slide_transition'
import DinoDialogHeader, { DinoDialogContent } from '../dino_dialog'
import Loader from '../loader'
import { useAlert } from '../../context/alert'
import ConnectionService from '../../services/connection/ConnectionService'
import RecoverPasswordService from '../../services/user/RecoverPasswordService'
import './styles.css'
import UserSettingsConstants from '../../constants/user/UserSettingsConstants'
import HashUtils from '../../utils/HashUtils'

const RecoverPasswordDialog: React.FC<RecoverPasswordDialogProps> = ({
  open,
  onClose
}) => {
  const language = useLanguage()
  const alert = useAlert()
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validCode, setValidCode] = useState(false)

  useEffect(() => {
    if (!open) {
      setCode("")
      setPassword("")
      setConfirmPassword("")
      setErrorMessage("")
      setIsLoading(false)
      setValidCode(false)
    } else {
      if (ConnectionService.isDisconnected()) {
        alert.showWarningAlert(language.data.CONNECTION_NECESSARY)
        onClose()
      }
    }
  }, [open, alert, onClose, language])

  const handleChangeCode = (event: ChangeEvent<HTMLInputElement>) => {
    const newCode = event.target.value
		
    if (newCode.length <= ApiConfig.RECOVER_PASSWORD_CODE_LENGTH) {
      setErrorMessage("")
		  setCode(newCode)
    }
  }

  const handleValidate = async () => {
    if (ConnectionService.isDisconnected()) {
      setErrorMessage(language.data.CONNECTION_NECESSARY)
      return
    }
    
    setIsLoading(true)
    const isValidCode = await RecoverPasswordService.verifyCode(code)
    if (isValidCode) {
      setValidCode(true)
      setErrorMessage("")
    } else {
      setErrorMessage(language.data.INVALID_RECOVER_CODE)
    }
    setIsLoading(false)
  }

	const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value

		if (newValue.length <= UserSettingsConstants.PASSWORD_MAX) {
			setPassword(event.target.value)
		}
	}

  const handleChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value

		if (newValue.length <= UserSettingsConstants.PASSWORD_MAX) {
			setConfirmPassword(event.target.value)
		}
	}

  const handlePasswordChange = async () => {
    setIsLoading(true)
    
		if (password.length < UserSettingsConstants.PASSWORD_MIN) {
			setErrorMessage(language.data.PASSWORD_MIN_LENGHT_ERROR_MESSAGE)
      setIsLoading(false)
			return
		}

		if (password !== confirmPassword) {
			setErrorMessage(language.data.PASSWORD_CONFIRM_LENGHT_ERROR_MESSAGE)
      setIsLoading(false)
			return
		}

		const newPassword = await HashUtils.sha256(password)
    
    const isSuccess = await RecoverPasswordService.changePassword(code, newPassword)

    if (isSuccess) {
      alert.showSuccessAlert(language.data.SUCCESS)
      onClose()
    } else {
      setErrorMessage(language.data.ERROR_CHANGING_PASSWORD)
    }
    setIsLoading(false)
	}

  const renderVerifyCodeForm = () => (
    <>
      <p>{language.data.RECOVER_EMAIL_INFO}</p>
      <form>
        <label htmlFor="recover_password__code_input">{language.data.CODE}</label>
        <input 
          id="recover_password__code_input"
          autoComplete="off"
          value={code} 
          onChange={handleChangeCode}
          type="text" 
          name="text" 
          required />
          {errorMessage && <p className="recover_password_dialog__error_message">{errorMessage}</p>}
      </form>
    </>
  )

  const renderChangePasswordForm = () => (
    <>
    <p>{language.data.UPDATE_YOUR_PASSWORD}</p>
    <form>
        <label htmlFor="recover_password__password_input">{language.data.INSERT_PASSWORD}</label>
        <input 
          id="recover_password__password_input"
          autoComplete="off"
          value={password} 
          onChange={handleChangePassword}
          type="password" 
          name="password" 
          required />
        <label htmlFor="recover_password__confirm_password_input">{language.data.CODE}</label>
        <input 
          id="recover_password__confirm_password_input"
          autoComplete="off"
          value={confirmPassword} 
          onChange={handleChangeConfirmPassword}
          type="password" 
          name="password" 
          required />
        {errorMessage && <p className="recover_password_dialog__error_message">{errorMessage}</p>}
      </form>
    </>
  )

  return (
    	<Dialog
        className='recover_password_dialog'
        fullWidth
        maxWidth='xs'
        onClose={onClose}
        TransitionComponent={TransitionSlide}
        open={open}
      >
        <Loader isLoading={isLoading}>
          <DinoDialogHeader>
            <h1>{language.data.RECOVER_PASSWORD_DIALOG}</h1>
          </DinoDialogHeader>
          <DinoDialogContent>
            {validCode ? renderChangePasswordForm() : renderVerifyCodeForm()}
          </DinoDialogContent>
          <div className='settings__change_password_dialog__buttons'>
            <Button onClick={onClose}>
              {language.data.CANCEL}
            </Button>
            <Button
              onClick={validCode ? handlePasswordChange : handleValidate}
              disabled={code.length !== ApiConfig.RECOVER_PASSWORD_CODE_LENGTH}
            >
              {validCode ? language.data.SETTINGS_SAVE : language.data.VALIDATE}
            </Button>
          </div>
        </Loader>
      </Dialog>
  )
}

export default RecoverPasswordDialog