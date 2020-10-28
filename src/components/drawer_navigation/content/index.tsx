import React from 'react'
import './styles.css'
import ContentProps from './props'
import AppBar from './app_bar'

const Content: React.FC<ContentProps> = ({
    component,
    onDrawerOpen,
}) => {
    return (
        <main
            className='drawer__navigation__content'
        >
            <div className='drawer__navigation__content__app_bar'>
                <AppBar
                    onDrawerOpen={onDrawerOpen}
                />
            </div>
            <div className='drawer__navigation__content__component'>
                {component}
            </div>
        </main>
    )
}

export default Content