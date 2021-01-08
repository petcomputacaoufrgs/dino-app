import React from 'react'
import CloseIconButtonProps from './props'
import { ReactComponent as CloseSVG } from '../../../../assets/icons/close.svg'
import IconButton from '..'
import { useLanguage } from '../../../../context/language'

const CloseIconButton: React.FC<CloseIconButtonProps> = ({
  onClose,
  dark,
  bigger,
}) => {
  const language = useLanguage()

  return (
    <IconButton
      icon={CloseSVG}
      aria-label={language.data.CLOSE_ARIA_LABEL}
      onClick={onClose}
      dark={dark}
      bigger={bigger}
    ></IconButton>
  )
}

export default CloseIconButton
