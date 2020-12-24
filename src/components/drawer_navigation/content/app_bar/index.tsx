import React from 'react'
import './styles.css'
import AppBarProps from './props'
import IconButton from '../../../button/icon_button'
import SyncInfo from './sync_info'
import ArrowBack from '../../../arrow_back'
import { ReactComponent as MenuIconSVG } from '../../../../assets/icons/menu.svg'
import { useUserSettings } from '../../../../context/provider/user_settings'

const AppBar: React.FC<AppBarProps> = ({ onDrawerOpen }) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)

  return (
    <div className="drawer__navigation__app_bar">
      <IconButton
        ariaLabel={language.OPEN_DRAWER_BUTTON_ARIA_LABEL}
        icon={MenuIconSVG}
        onClick={onDrawerOpen}
        className="drawer__navigation__app_bar__button"
      />
      <ArrowBack />
      <SyncInfo />
    </div>
  )
}

export default AppBar
