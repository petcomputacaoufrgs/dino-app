import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import AdaptableMenuProps from './props'
import DrawerNavigation from '../drawer_navigation/index'
import BottomNavigation from '../bottom_navigation/index'
import ScreenOrientationService from '../../services/ScreenOrientationService'

/**
 * @description Menu adaptável para mobile e desktop
 * @param props Propriedade com os itens utilizados no menu
 * @returns Elemento JSX com o menu correto
 */
const AdaptableMenu = (props: AdaptableMenuProps): JSX.Element => {
    
    /** Estado que registra a orientação da tela */
    const [isLandscape, setIfIsLandscape] = useState(ScreenOrientationService.isLandscape())

    /**
     * @description Função invocada quando a orientação da tela muda
     */
    const onScreenOrientationChange = () => {
        setIfIsLandscape(ScreenOrientationService.isLandscape())
    }

    /** Configura a função onScreenOrientationChange para ser invocada quando houver mudança na horientação da tela */
    ScreenOrientationService.setOnScreenOrientationChangeEvent(onScreenOrientationChange)

    /**
     * @description Retorna o menu adaptavél com base no dispositivo utilizado e na horientação da tela
     * @returns Elemento JSX com o menu
     */
    const renderAdaptableMenu = (): JSX.Element => {
        if (isMobile) {
            return renderMobileMenuWithContent()
        } else {
            return renderDrawerMenuWithContent(true)
        }
    }

    /**
     * @description Retorna o menu adaptável para mobile com base na horientação da tela
     * @returns Elemento JSX com o menu
     */
    const renderMobileMenuWithContent = (): JSX.Element => {
        if (isLandscape) {
            return renderDrawerMenuWithContent(false)
        } else {
            return renderBottomNavigationMenuWithContent()
        }
    }

    /**
     * @description Retorna o menu lateral
     * @param mini Define o tipo do menu, se mini então ele manterá um mini menu lateral de ícones quando o menu estiver fechado
     * @returns Elemento JSX contendo o menu
     */
    const renderDrawerMenuWithContent = (mini: boolean): JSX.Element => {
        return (
            <DrawerNavigation 
                mini={mini} 
                items={props.items} 
                component={props.component}
                topBarComponent={props.topBarComponent} />
        )
    }

    /**
     * @description Retorna o menu inferior
     * @returns Elemento JSX com o menu
     */
    const renderBottomNavigationMenuWithContent = (): JSX.Element => {
        return ( 
            <BottomNavigation 
                selectedItem={props.selectedItem} 
                items={props.items} 
                component={props.component}
                topBarComponent={props.topBarComponent} />
        )
    }

    return (
        renderAdaptableMenu()
    )
}

export default AdaptableMenu