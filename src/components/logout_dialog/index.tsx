import AgreementDialog from '../agreement_dialog'
import AgreementDialogProps from '../agreement_dialog/props'
import './styles.css'
import { useLanguage } from '../../provider/app_provider'
import AuthService from '../../services/auth/AuthService'

const LogoutDialog = (): [() => JSX.Element, () => void] => {
  const languageContext = useLanguage()

  const language = languageContext.current

  const agreementDialogProps: AgreementDialogProps = {
    onAgree: AuthService.googleLogout,
    question: language.LOGOUT_DIALOG_QUESTION,
    description: language.LOGOUT_DIALOG_DESCRIPTION,
    agreeOptionText: language.AGREEMENT_OPTION_TEXT,
    disagreeOptionText: language.DISAGREEMENT_OPTION_TEXT,
  }

  const [Dialog, showAgreementDialog] = AgreementDialog(agreementDialogProps)

  return [Dialog, showAgreementDialog]
}

export default LogoutDialog
