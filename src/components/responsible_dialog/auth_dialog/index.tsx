import React, { useState, useEffect, ChangeEvent } from 'react'
import { Dialog } from '@material-ui/core'
import Loader from '../../loader'
import TransitionSlide from '../../slide_transition'
import { DinoDialogContent, DinoDialogHeader } from '../../dino_dialog'
import { useLanguage } from '../../../context/language/index'
import Button from '../../button'
import ConnectionService from '../../../services/connection/ConnectionService'
import ResponsibleAuthConstants from '../../../constants/auth/ResponsibleAuthConstants'
import ResponsibleAuthService from '../../../services/auth/ResponsibleAuthService'
import '../styles.css'
import './styles.css'
import TextButton from '../../button/text_button'
import RecoverPasswordDialog from '../recover_password_dialog'
import { useAlert } from '../../../context/alert/index'

const ResponsibleAuthDialog: React.FC<{
  open: boolean
}> = ({
  open
}) => {
  const alert = useAlert()
  const language = useLanguage()
  const [isLoading, setLoading] = useState(false)
  const [isConnected, setConnected] = useState(true)
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [openRecoverDialog, setOpenRecoverDialog] = useState(false)

  useEffect(() => {
    setPassword("")
    setErrorMessage("")
    setLoading(false)
    setConnected(true)
    setOpenRecoverDialog(false)
  }, [])

  useEffect(() => {
    if (ConnectionService.isDisconnected() && isConnected) {
      setConnected(false)
    }
  }, [isConnected])

  const handlePasswordChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value
		
    if (newPassword.length <= ResponsibleAuthConstants.PASSWORD_LENGTH_MAX) {
      setErrorMessage("")
		  setPassword(newPassword)
    }
  }

  const handleAuthButtonClick = async () => {
    if (ConnectionService.isDisconnected()) {
      setErrorMessage(language.data.CONNECTION_NECESSARY)
      setConnected(false)
      return
    }
    
    setLoading(true)
    const success = await ResponsibleAuthService.responsibleLogin(password)
    if (!success) {
      setErrorMessage(language.data.WRONG_PASSWORD)
    }

    setLoading(false)
  } 

  const handleRecoverPassword = async () => {
    setLoading(true)
    const success = await ResponsibleAuthService.requestCode()
		if (success) {
			setOpenRecoverDialog(true)
		} else {
			alert.showErrorAlert(language.data.ERROR_REQUESTING_RECOVER_CODE)
		}
    setLoading(false)
	}

  const disableButton = () => {
    const greaterThanMax = password.length > ResponsibleAuthConstants.PASSWORD_LENGTH_MAX
    const lessThanMin = password.length < ResponsibleAuthConstants.PASSWORD_LENGTH_MIN

    return greaterThanMax || lessThanMin
  }

  return (
    <Dialog
      className='responsible_auth_dialog'
      fullWidth
      maxWidth='xs'
      TransitionComponent={TransitionSlide}
      open={open}
    >
      <Loader isLoading={isLoading}>
        <DinoDialogHeader>
          <h1>{language.data.RESPONSIBLE_LOGIN}</h1>
        </DinoDialogHeader>
        <form>
        <DinoDialogContent>
          <label htmlFor="responsible_auth_dialog__input">{language.data.PASSWORD}</label>
          <input 
            id="responsible_auth_dialog__input"
            className="responsible_input"
            autoComplete="off"
            value={password} 
            onChange={handlePasswordChanged}
            type="password" 
            required />
            {errorMessage && <p className="responsible__error_message">{errorMessage}</p>}
          <TextButton onClick={handleRecoverPassword}>
            {language.data.FORGOT_PASSWORD}
          </TextButton>
        </DinoDialogContent>
          <div className='responsible_auth_dialog__buttons'>
            <Button
              type="submit"
              onClick={handleAuthButtonClick}
              disabled={!isConnected || disableButton()}
            >
              {language.data.ACCESS_BUTTON}
            </Button>
          </div>
        </form>
      </Loader>
      <RecoverPasswordDialog open={openRecoverDialog} onClose={() => setOpenRecoverDialog(false)}/>
    </Dialog>
  )
}

export default ResponsibleAuthDialog