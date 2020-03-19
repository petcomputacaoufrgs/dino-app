import React, { Fragment } from 'react'
import LogoutButton from '../../components/logout_button'
import GlossarySVG from '../../images/glossary.svg'
import GamesSVG from '../../images/games.svg'
import HomeSVG from '../../images/home.svg'
import AdaptableMenu from '../../components/adaptable_menu/index';


/**
 * @description Tela principal da aplicação
 * @returns Elemento JSX com a tela principal do aplicativo
 **/
const Main = () : JSX.Element => {

    /**
     * @description Função chamada quando seu item for selecionado no menu
     * @param index Indice do item que invocou a função no menu
     */
    const goToHome = (index: number): void => {
        console.log('home')
        console.log(index)
    }

    /**
     * @description Função chamada quando seu item for selecionado no menu
     * @param index Indice do item que invocou a função no menu
     */
    const goToGames = (index: number): void => {
        console.log('jogos')
        console.log(index)
    }

    /**
     * @description Função chamada quando seu item for selecionado no menu
     * @param index Indice do item que invocou a função no menu
     */
    const goToGlossary = (index: number): void => {
        console.log('glossario')
        console.log(index)
    }

    /** Itens do menu */
    const items = [
        {
            'image': HomeSVG,
            'name': 'Home',
            'onClick': goToHome,
            'component': <LogoutButton />,
        },
        {
            'image': GamesSVG,
            'name': 'Jogos',
            'onClick': goToGames,
            'component': <Fragment />,
        },
        {
            'image':GlossarySVG,
            'name': 'Glossário',
            'onClick': goToGlossary,
            'component': <Fragment />,
        }
    ]

    return (
        <AdaptableMenu items={items} />
    )
}

export default Main