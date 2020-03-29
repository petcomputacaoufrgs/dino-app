import React from 'react'
import LogoutButton from '../../components/logout_button'
import GlossarySVG from '../../images/glossary.svg'
import GamesSVG from '../../images/games.svg'
import HomeSVG from '../../images/home.svg'
import AdaptableMenu from '../../components/adaptable_menu/'
import PathConstants from '../../constants/PathConstants'
import PrivateRoute from '../../components/private_route'
import { useLocation } from 'react-router';
import HistoryService from '../../services/HistoryService';
import Glossary from '../glossary'


/**
 * @description Tela principal da aplicação
 * @returns Elemento JSX com a tela principal do aplicativo
 **/
const Main = () : JSX.Element => {

    const location = useLocation()

    /**
     * @description Função chamada quando seu item for selecionado no menu
     * @param index Indice do item que invocou a função no menu
     */
    const goToHome = (): void => {
        HistoryService.push(PathConstants.HOME)
    }

    /**
     * @description Função chamada quando seu item for selecionado no menu
     * @param index Indice do item que invocou a função no menu
     */
    const goToGames = (): void => {
        HistoryService.push(PathConstants.GAMES)
    }

    /**
     * @description Função chamada quando seu item for selecionado no menu
     * @param index Indice do item que invocou a função no menu
     */
    const goToGlossary = (): void => {
        HistoryService.push(PathConstants.GLOSSARY)
    }

    /** Itens do menu */
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
            'component': <Glossary />,
        }
    ]

    const getSelectedItem = (): number => {
        if (location.pathname === PathConstants.GAMES) {
            return 1
        } else if (location.pathname === PathConstants.GLOSSARY) {
            return 2
        } else {
            return 0
        }
    }

    /** Componente interno do exibido com o menu definido pelo path */
    const renderMainComponent = (): JSX.Element => {
        return (
            <>
                <PrivateRoute exact path={PathConstants.HOME} component={LogoutButton} />
                <PrivateRoute exact path={PathConstants.GAMES} component={() => <>GAMES</>} />
                <PrivateRoute exact path={PathConstants.GLOSSARY} component={() => <>GLOSSARY</>} />
            </>
        )
    }

    return (
        <AdaptableMenu selectedItem={getSelectedItem()} items={items} component={renderMainComponent()} />
    )
}

export default Main