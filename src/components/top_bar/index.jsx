import React from 'react'
import './styles.css'
import AppConstants from '../../constants/AppConstants'

const TopBar = () => (
  <div className="top_bar">
    <div className="top_bar__app_name">{AppConstants.APP_NAME}</div>
  </div>
)

export default TopBar
