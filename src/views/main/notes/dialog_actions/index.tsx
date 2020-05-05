import React, { useContext } from 'react'
import { LanguageContext } from '../../../../provider/language_provider'
import MaterialDialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import DialogActionsProps from './props'

const DialogActions = (props: DialogActionsProps) => {
    const languageProvider = useContext(LanguageContext)
    const language = languageProvider.currentLanguage

    return (
        <MaterialDialogActions className='note_card_dialog__save'>
            <Button 
                onClick={props.onSave} 
                aria-label={language.NOTE_DIALOG_SAVE_BUTTON_LABEL}
                variant="contained"
                size="small"
                startIcon={<SaveIcon />}
            >
                {language.NOTE_DIALOG_SAVE_BUTTON_TEXT}
            </Button>
        </MaterialDialogActions>
    )
}

export default DialogActions