import React from 'react'
import './styles.css'
import { useLanguage } from '../../../../context_provider/app_settings'
import AppBarProps from './props'
import { Menu as MenuIcon } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'

const AppBar: React.FC<AppBarProps> = ({
    open,
    onDrawerOpen
}) => {
    const language = useLanguage().current

    return (
        <div
            className={'drawer__navigation__app_bar'}
        >
            <IconButton
                color="inherit"
                aria-label={language.OPEN_MENU_ARIA_LABEL}
                onClick={onDrawerOpen}
                className='drawer__navigation__app_bar__button'
            >
                <MenuIcon />
            </IconButton>
        </div>
    )
}

export default AppBar