import { useContext } from 'react'
import { LanguageContext } from '../language_provider'
import AuthService from '../../services/AuthService'
import GenericAgreementDialog from '../generic_agreement_dialog'
import AgreementDialogProps from '../generic_agreement_dialog/props'
import './styles.css'

/**
 * @description Dialog de logout
 */
const LogoutDialog = (): [() => JSX.Element, () => void] => {

    const languageProvider = useContext(LanguageContext)

    const language = languageProvider.currentLanguage

    const logout = () => {
        AuthService.google_logout()
        languageProvider.updateLanguage()
    }

    const agreementDialogProps: AgreementDialogProps = {
        'onAgree': logout,
        'question': language.LOGOUT_DIALOG_QUESTION,
        'description': language.LOGOUT_DIALOG_DESCRIPTION,
        'agreeOptionText': language.AGREEMENT_OPTION_TEXT,
        'disagreeOptionText': language.DISAGREEMENT_OPTION_TEXT
    }

    const [Dialog, showAgreementDialog] = GenericAgreementDialog(agreementDialogProps)

    return [Dialog, showAgreementDialog]
}

export default LogoutDialog