import React from 'react'
import DialogActionsProps from './props'
import './styles.css'
import { useLanguage } from '../../../../../context_provider/app_settings'
import MaterialDialogActions from '@material-ui/core/DialogActions'
import SVGButton from '../../../../../components/button/svg_button'
import { ReactComponent as DoneIcon } from '../../../../../assets/icons/done.svg'

const DialogActions: React.FC<DialogActionsProps> = (
  {
    onSave
  }
) => {
  const language = useLanguage().current

  return (
    <MaterialDialogActions className="note__note_dialog__actions">
      <SVGButton
        onClick={onSave}
        ariaLabel={language.DIALOG_SAVE_BUTTON_LABEL}
        SVG={DoneIcon}
        fab
      />
    </MaterialDialogActions>
  )
}

export default DialogActions
