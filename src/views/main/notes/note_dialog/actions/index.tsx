import React from 'react'
import DialogActionsProps from './props'
import './styles.css'
import { useLanguage } from '../../../../../context_provider/app_settings'
import MaterialDialogActions from '@material-ui/core/DialogActions'
import DoneButton from '../../../../../components/button/done_button'

const DialogActions: React.FC<DialogActionsProps> = (
  {
    onSave
  }
) => {
  const language = useLanguage().current

  return (
    <MaterialDialogActions className="note__note_dialog__actions">
      <DoneButton
        onClick={onSave}
        ariaLabel={language.DIALOG_SAVE_BUTTON_LABEL}
      />
    </MaterialDialogActions>
  )
}

export default DialogActions
