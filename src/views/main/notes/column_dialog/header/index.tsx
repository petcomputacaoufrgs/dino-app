import React from 'react'
import NoteColumnDialogHeaderProps from './props'
import './styles.css'
import { CardHeader } from '@material-ui/core'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'

const NoteColumnDialogHeader: React.FC<NoteColumnDialogHeaderProps> = ({
  editing,
}) => {
  const language = useCurrentLanguage()

  return (
    <CardHeader
      title={editing ? language.COLUMN_EDIT_LABEL : language.COLUMN_ADD_LABEL}
      className="note__column_dialog__header"
    />
  )
}

export default NoteColumnDialogHeader
