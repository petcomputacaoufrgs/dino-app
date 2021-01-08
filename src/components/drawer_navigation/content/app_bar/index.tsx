import React from 'react'
import './styles.css'
import AppBarProps from './props'
import IconButton from '../../../button/icon_button'
import SyncInfo from './sync_info'
import ArrowBack from '../../../arrow_back'
import { ReactComponent as MenuIconSVG } from '../../../../assets/icons/menu.svg'
import { useLanguage } from '../../../../context/language'

const AppBar: React.FC<AppBarProps> = ({ onDrawerOpen }) => {
  const language = useLanguage()

  return (
    <div className="drawer__navigation__app_bar">
      <IconButton
        ariaLabel={language.data.OPEN_DRAWER_BUTTON_ARIA_LABEL}
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
