import React from 'react'
import NoteColumnDialogContentProps from './props'
import { TextField } from '@material-ui/core'
import { useCurrentLanguage } from '../../../../../context_provider/app_settings'

const NoteColumnDialogContent: React.FC<NoteColumnDialogContentProps> = ({
  onTitleChange,
  title,
  invalidTitle,
  invalidMessage,
  inputRef
}) => {
  const language = useCurrentLanguage()

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
      label={language.COLUMN_TITLE_LABEL}
      type="name"
      ref = {inputRef}
    />
  )
}

export default NoteColumnDialogContent
