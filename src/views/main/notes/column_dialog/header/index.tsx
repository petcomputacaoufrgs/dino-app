import React from 'react'
import NoteColumnDialogHeaderProps from './props'
import './styles.css'
import { CardHeader } from '@material-ui/core'
import { useUserSettings } from '../../../../../context/provider/user_settings'

const NoteColumnDialogHeader: React.FC<NoteColumnDialogHeaderProps> = ({
  editing,
}) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  
  return (
    <CardHeader
      title={editing ? language.COLUMN_EDIT_LABEL : language.COLUMN_ADD_LABEL}
      className="note__column_dialog__header"
    />
  )
}

export default NoteColumnDialogHeader
