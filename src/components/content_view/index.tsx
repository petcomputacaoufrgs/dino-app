import React, { Fragment } from 'react'
import ContentViewProps from './props'        
import { isMobile, withOrientationChange } from 'react-device-detect'
import BottomNavigation from '../bottom_navigation'
import MenuDrawer from '../menu_drawer'

/**
 * @description Define uma tela adaptada para exibição do conteúdo junto com um menu conforme o dispositivo do usuário
 */
const ContentView = (props: ContentViewProps) => {

    const renderMenu = (): JSX.Element => {
        if (isMobile) {
            return renderMobileMenu()
        } else {
            return renderDrawerMenu()
        }
    }

    const renderMobileMenu = (): JSX.Element => {
        const mobileMenu = (props: any) => {
            console.log(props)
            const { isLandscape, isPortrait } = props

            if (isLandscape) {
                return  renderDrawerMenu()
            }
              
            if (isPortrait) {
                return  renderBottomNavigationMenu()
            }
        }

        return withOrientationChange(mobileMenu)
    }

    const renderDrawerMenu = (): JSX.Element => {
        return (<MenuDrawer items={props.menuItems} />)
    }

    const renderBottomNavigationMenu = (): JSX.Element => {
        return (<BottomNavigation items={props.menuItems} />)
    }

    return (
        <Fragment>
            {renderMenu()}
            {props.component}
        </Fragment>
    )
}

export default ContentView