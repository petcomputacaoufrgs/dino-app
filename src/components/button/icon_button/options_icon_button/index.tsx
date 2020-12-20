import React from 'react'
import MoreVert from '@material-ui/icons/MoreVert'
import OptionsIconButtonProps from './props'
import { ReactComponent as MoreSVG } from '../../../../assets/icons/more_vert.svg'
import IconButton from '..'
import { useUserSettings } from '../../../../context/provider/user_settings'

const OptionsIconButton: React.FC<OptionsIconButtonProps> = ({
  onClick,
  dark,
  bigger,
}) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  
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
