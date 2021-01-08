import React from 'react'
import MoreVert from '@material-ui/icons/MoreVert'
import OptionsIconButtonProps from './props'
import { ReactComponent as MoreSVG } from '../../../../assets/icons/more_vert.svg'
import IconButton from '..'
import { useLanguage } from '../../../../context/language'

const OptionsIconButton: React.FC<OptionsIconButtonProps> = ({
  onClick,
  dark,
  bigger,
}) => {
  const language = useLanguage()

  return (
    <IconButton
      icon={MoreSVG}
      ariaLabel={language.data.OPTIONS_ARIA_LABEL}
      onClick={onClick}
      dark={dark}
      bigger={bigger}
    >
      <MoreVert />
    </IconButton>
  )
}

export default OptionsIconButton
