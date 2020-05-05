import { useContext } from 'react'
import { LanguageContext } from '../../provider/language_provider'
import AuthService from '../../services/AuthService'
import AgreementDialog from '../agreement_dialog'
import AgreementDialogProps from '../agreement_dialog/props'
import './styles.css'

/**
 * @description Dialog de logout
 */
const LogoutDialog = (): [() => JSX.Element, () => void] => {

    const languageContext = useContext(LanguageContext)

    const language = languageContext.currentLanguage

    const logout = () => {
        AuthService.google_logout()
        languageContext.updateLanguage()
    }

    const agreementDialogProps: AgreementDialogProps = {
        'onAgree': logout,
        'question': language.LOGOUT_DIALOG_QUESTION,
        'description': language.LOGOUT_DIALOG_DESCRIPTION,
        'agreeOptionText': language.AGREEMENT_OPTION_TEXT,
        'disagreeOptionText': language.DISAGREEMENT_OPTION_TEXT
    }

    const [Dialog, showAgreementDialog] = AgreementDialog(agreementDialogProps)

    return [Dialog, showAgreementDialog]
}

export default LogoutDialog