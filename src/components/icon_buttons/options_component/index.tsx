import React from 'react'
import MoreVert from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import OptionsComponentProps from './props'
import { useCurrentLanguage } from '../../../context_provider/app_settings'

const OptionsComponent = ({ onClick }: OptionsComponentProps): JSX.Element => {
  const language = useCurrentLanguage()

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
