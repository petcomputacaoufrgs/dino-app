import React from 'react'
import './styles.css'
import AppBarProps from './props'
import IconButton from '../../../button/icon_button'
import SyncInfo from './sync_info'
import ArrowBack from '../../../arrow_back'
import {ReactComponent as MenuIconSVG} from '../../../../assets/icons/menu.svg'

const AppBar: React.FC<AppBarProps> = ({ onDrawerOpen }) => {
  return (
    <div className="drawer__navigation__app_bar">
      <IconButton icon={MenuIconSVG} onClick={onDrawerOpen} />
      <ArrowBack />
      <SyncInfo />
    </div>
  )
}

export default AppBar
