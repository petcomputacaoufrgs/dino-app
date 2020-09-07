import React from 'react'
import MoreVert from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import OptionsComponentProps from './props'
import { useLanguage } from '../../context_provider/app_settings'


const OptionsComponent = ({onClick}: OptionsComponentProps): JSX.Element => {
  const language = useLanguage().current

  return (
    <IconButton 
      edge="end" 
      aria-label={language.OPTIONS_ARIA_LABEL} 
      onClick={onClick}
    >
        <MoreVert />
    </IconButton>
  )
}

export default OptionsComponent
