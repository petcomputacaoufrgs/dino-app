import React from 'react'
import './styles.css'
import ContentProps from './props'

const Content: React.FC<ContentProps> = ({
    component,
}) => {
    return (
        <main
            className='drawer__navigation__content'
        >
            {component}
        </main>
    )
}

export default Content