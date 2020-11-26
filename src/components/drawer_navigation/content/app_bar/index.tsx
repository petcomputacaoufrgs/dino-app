import React from 'react'
import './styles.css'
import AppBarProps from './props'
import { Menu as MenuIcon } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import SyncInfo from './sync_info'
import ArrowBack from '../../../arrow_back'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'

const AppBar: React.FC<AppBarProps> = ({ onDrawerOpen }) => {
  const language = useCurrentLanguage()

  return (
    <div className="drawer__navigation__app_bar">
      <IconButton
        color="inherit"
        aria-label={language.OPEN_MENU_ARIA_LABEL}
        onClick={onDrawerOpen}
      >
        <MenuIcon />
      </IconButton>
      <ArrowBack />
      <SyncInfo />
    </div>
  )
}

export default AppBar
