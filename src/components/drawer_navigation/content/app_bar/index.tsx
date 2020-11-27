import React from 'react'
import './styles.css'
import AppBarProps from './props'
import IconButton from '../../../button/icon_button'
import SyncInfo from './sync_info'
import ArrowBack from '../../../arrow_back'
import {ReactComponent as MenuIconSVG} from '../../../../assets/icons/menu.svg'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'

const AppBar: React.FC<AppBarProps> = ({ onDrawerOpen }) => {
  const language = useCurrentLanguage()
  
  return (
    <div className="drawer__navigation__app_bar">
      <IconButton
        ariaLabel={language.OPEN_DRAWER_BUTTON_ARIA_LABEL}
        icon={MenuIconSVG}
        onClick={onDrawerOpen}
      />
      <ArrowBack />
      <SyncInfo />
    </div>
  )
}

export default AppBar
