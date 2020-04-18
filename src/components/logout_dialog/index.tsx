import { useContext } from 'react'
import { LanguageProviderContext } from '../language_provider'
import AuthService from '../../services/AuthService'
import GenericAgreementDialog from '../generic_agreement_dialog'
import AgreementDialogProps from '../generic_agreement_dialog/props'
import './styles.css'

/**
 * @description Dialog de logout
 */
const LogoutDialog = (): [() => JSX.Element, () => void] => {

    const languageContext = useContext(LanguageProviderContext)

    const logout = () => {
        AuthService.google_logout()
    }

    const agreementDialogProps: AgreementDialogProps = {
        'onAgree': logout,
        'question': languageContext.LOGOUT_DIALOG_QUESTION,
        'description': languageContext.LOGOUT_DIALOG_DESCRIPTION,
        'agreeOptionText': languageContext.AGREEMENT_OPTION_TEXT,
        'disagreeOptionText': languageContext.DISAGREEMENT_OPTION_TEXT
    }

    const [Dialog, showAgreementDialog] = GenericAgreementDialog(agreementDialogProps)

    return [Dialog, showAgreementDialog]
}

export default LogoutDialog