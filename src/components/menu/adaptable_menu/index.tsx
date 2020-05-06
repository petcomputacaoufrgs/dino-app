import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import AdaptableMenuProps from './props'
import BottomNavigation from '../bottom_navigation'
import ScreenService from '../../../services/ScreenService'

/**
 * @description Menu adaptável para mobile e desktop
 * @param props Propriedade com os itens utilizados no menu
 * @returns Elemento JSX com o menu correto
 */
const AdaptableMenu = (props: AdaptableMenuProps): JSX.Element => {
    
    /** Estado que registra a orientação da tela */
    const [isLandscape, setIfIsLandscape] = useState(ScreenService.isLandscape())

    /**
     * @description Função invocada quando a orientação da tela muda
     */
    const onScreenOrientationChange = () => {
        setIfIsLandscape(ScreenService.isLandscape())
    }

    /** Configura a função onScreenOrientationChange para ser invocada quando houver mudança na horientação da tela */
    ScreenService.setOnScreenOrientationChangeEvent(onScreenOrientationChange)

    /**
     * @description Retorna o menu adaptavél com base no dispositivo utilizado e na horientação da tela
     * @returns Elemento JSX com o menu
     */
    const renderAdaptableMenu = (): JSX.Element => {
        if (isMobile) {
            return renderMobileMenu()
        } else {
            return renderWithoutBottomMenu(true)
        }
    }

    /**
     * @description Retorna o menu adaptável para mobile com base na horientação da tela
     * @returns Elemento JSX com o menu
     */
    const renderMobileMenu = (): JSX.Element => {
        if (isLandscape) {
            return renderWithoutBottomMenu(false)
        } else {
            return renderBottomNavigation()
        }
    }

    /**
     * @description Retorna o menu lateral
     * @param mini Define o tipo do menu, se mini então ele manterá um mini menu lateral de ícones quando o menu estiver fechado
     * @returns Elemento JSX contendo o menu
     */
    const renderWithoutBottomMenu = (mini: boolean): JSX.Element => {
        return (
            <BottomNavigation 
                hideBottomBar={true}
                selectedItem={props.selectedItem} 
                showMiniDrawer={mini} 
                groupedItems={props.groupedItems} 
                component={props.component} />
        )
    }

    /**
     * @description Retorna o menu inferior
     * @returns Elemento JSX com o menu
     */
    const renderBottomNavigation = (): JSX.Element => {
        return ( 
            <BottomNavigation 
                selectedItem={props.selectedItem} 
                groupedItems={props.groupedItems} 
                component={props.component} />
        )
    }

    return (
        renderAdaptableMenu()
    )
}

export default AdaptableMenu