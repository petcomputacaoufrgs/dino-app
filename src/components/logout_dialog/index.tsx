import React from 'react'
import AgreementDialog from '../agreement_dialog'
import LogoutDialogProps from './props'
import AgreementDialogProps from '../agreement_dialog/props'
import { useUserSettings } from '../../context/provider/user_settings'
import './styles.css'

const LogoutDialog: React.FC<LogoutDialogProps> = ({
  open,
  onAgree,
  onDisagree,
}) => {
  const userSettings = useUserSettings()
    
  const language = userSettings.service.getLanguage(userSettings)

  const agreementDialogProps: AgreementDialogProps = {
    onAgree: onAgree,
    onDisagree: onDisagree,
    question: language.LOGOUT_DIALOG_QUESTION,
    description: language.LOGOUT_DIALOG_DESCRIPTION,
    agreeOptionText: language.AGREEMENT_OPTION_TEXT,
    disagreeOptionText: language.DISAGREEMENT_OPTION_TEXT,
    open: open,
  }

  return <AgreementDialog {...agreementDialogProps} />
}

export default LogoutDialog
