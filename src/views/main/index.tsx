import React, { Fragment } from 'react';
import LogoutButton from '../../components/logout_button'
import MenuDrawer from '../../components/menu_drawer'
import GlossarySVG from '../../images/glossary.svg'
import GamesSVG from '../../images/games.svg'
import HomeSVG from '../../images/home.svg'
import './styles.css'
/**
 * @description Tela principal da aplicação
 **/
const Main = () : JSX.Element => {

    const goToHome = () => {
        console.log('home')
    }

    const goToGames = () => {
        console.log('jogos')
    }

    const goToGlossary = () => {
        console.log('glossario')
    }

    const items = [
        {
            'image': HomeSVG,
            'name': 'Home',
            'onClick': goToHome,
        },
        {
            'image': GamesSVG,
            'name': 'Jogos',
            'onClick': goToGames,
        },
        {
            'image':GlossarySVG,
            'name': 'Glossário',
            'onClick': goToGlossary,
        }
    ]

    return (
        <Fragment>
            <MenuDrawer items={items}/>
            <div className='main'>
                <LogoutButton />
            </div>
        </Fragment>
    )
}

export default Main