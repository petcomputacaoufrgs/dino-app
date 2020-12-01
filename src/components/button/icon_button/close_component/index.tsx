import React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import CloseComponentProps from './props'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import { ReactComponent as CloseSVG } from '../../../../assets/icons/close.svg'
import IconButton from '..'

const CloseComponent = ({ onClose }: CloseComponentProps): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <IconButton
      icon={CloseSVG}
      aria-label={language.CLOSE_ARIA_LABEL}
      onClick={onClose}
    >
      <CloseIcon color="action" />
    </IconButton>
  )
}

export default CloseComponent
