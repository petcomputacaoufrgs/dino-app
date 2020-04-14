import React from 'react'
import './styles.css'
import LogoutButton from '../logout_button'
import AppConstants from '../../constants/AppConstants'

const TopBar = () => (
    <div className='top_bar'>
        <div className='top_bar__app_name'>
            {AppConstants.APP_NAME}
        </div>
        <div className='top_bar__logout_button'>
            <div>
                <LogoutButton />
            </div>
        </div>
    </div>
)

export default TopBar