import React from 'react'
import CloseIconButtonProps from './props'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import { ReactComponent as CloseSVG } from '../../../../assets/icons/close.svg'
import IconButton from '..'

const CloseIconButton: React.FC<CloseIconButtonProps> = ({
  onClose,
  dark,
  bigger,
}) => {
  const language = useCurrentLanguage()

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
