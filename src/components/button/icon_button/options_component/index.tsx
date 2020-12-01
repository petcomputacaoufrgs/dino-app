import React from 'react'
import MoreVert from '@material-ui/icons/MoreVert'
import OptionsComponentProps from './props'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import { ReactComponent as MoreSVG } from '../../../../assets/icons/more_vert.svg'
import IconButton from '..'

const OptionsComponent = ({ onClick }: OptionsComponentProps): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <IconButton
      icon={MoreSVG}
      ariaLabel={language.OPTIONS_ARIA_LABEL}
      onClick={onClick}
    >
      <MoreVert />
    </IconButton>
  )
}

export default OptionsComponent
