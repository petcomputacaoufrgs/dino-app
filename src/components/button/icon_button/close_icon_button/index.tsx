import React from 'react'
import CloseIconButtonProps from './props'
import { ReactComponent as CloseSVG } from '../../../../assets/icons/close.svg'
import IconButton from '..'
import { useUserSettings } from '../../../../context/provider/user_settings'

const CloseIconButton: React.FC<CloseIconButtonProps> = ({
  onClose,
  dark,
  bigger,
}) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  
  return (
    <IconButton
      icon={CloseSVG}
      aria-label={language.CLOSE_ARIA_LABEL}
      onClick={onClose}
      dark={dark}
      bigger={bigger}
    ></IconButton>
  )
}

export default CloseIconButton
