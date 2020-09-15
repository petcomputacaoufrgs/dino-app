import React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import CloseComponentProps from './props'
import { useLanguage } from '../../context_provider/app_settings'

const CloseComponent = ({ onClose }: CloseComponentProps): JSX.Element => {
  const language = useLanguage().current

  return (
    <IconButton
      edge="end"
      size="small"
      aria-label={language.CLOSE_ARIA_LABEL}
      onClick={onClose}
    >
      <CloseIcon color="action" />
    </IconButton>
  )
}

export default CloseComponent
