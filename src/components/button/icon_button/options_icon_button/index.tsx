import React from 'react'
import MoreVert from '@material-ui/icons/MoreVert'
import OptionsIconButtonProps from './props'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import { ReactComponent as MoreSVG } from '../../../../assets/icons/more_vert.svg'
import IconButton from '..'

const OptionsIconButton: React.FC<OptionsIconButtonProps> = ({
  onClick,
  dark,
  bigger,
}) => {
  const language = useCurrentLanguage()

  return (
    <IconButton
      icon={MoreSVG}
      ariaLabel={language.OPTIONS_ARIA_LABEL}
      onClick={onClick}
      dark={dark}
      bigger={bigger}
    >
      <MoreVert />
    </IconButton>
  )
}

export default OptionsIconButton
