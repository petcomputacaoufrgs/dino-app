import React from 'react'
import NoteColumnDialogContentProps from './props'
import { TextField } from '@material-ui/core'
import NoteColumnConstants from '../../../../../constants/note/NoteColumnConstants'
import { useUserSettings } from '../../../../../context/provider/user_settings'

const NoteColumnDialogContent: React.FC<NoteColumnDialogContentProps> = ({
  onTitleChange,
  title,
  invalidTitle,
  invalidMessage,
  inputRef,
}) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(event.target.value as string)
  }

  return (
    <TextField
      required
      fullWidth
      value={title}
      onChange={handleTitleChange}
      error={invalidTitle}
      helperText={invalidMessage}
      autoFocus
      margin="dense"
      label={`${language.COLUMN_TITLE_LABEL} (${language.MAX} ${NoteColumnConstants.TITLE_MAX})`}
      type="name"
      ref={inputRef}
    />
  )
}

export default NoteColumnDialogContent
