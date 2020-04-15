import React from 'react'
import GlossarySVG from '../../images/glossary.svg'
import GamesSVG from '../../images/games.svg'
import HomeSVG from '../../images/home.svg'
import AdaptableMenu from '../../components/adaptable_menu'
import PathConstants from '../../constants/PathConstants'
import PrivateRoute from '../../components/private_route'
import { useLocation, Switch } from 'react-router';
import GlossaryItem from '../../components/glossary/glossary_item'
import GlossarySearchBar from '../../components/glossary/glossary_search'
import TopBar from '../../components/top_bar'
import HistoryService from '../../services/HistoryService'

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
            'component': <GlossarySearchBar />,
        }
    ]

    const getSelectedItem = (): number => {
        if (location.pathname === PathConstants.GAMES) {
            return 1
        } else if (location.pathname.includes(PathConstants.GLOSSARY)) {
            return 2
        } return 0
    }
    

    /** Componente interno do exibido com o menu definido pelo path */
    const renderMainComponent = (): JSX.Element => {
        return(
            <Switch>
                <PrivateRoute exact path={PathConstants.GAMES} component={() => <>GAMES</>} />
                <PrivateRoute exact path={PathConstants.GLOSSARY} component={GlossarySearchBar} />
                <PrivateRoute path={`${PathConstants.GLOSSARY}/:id`} component={GlossaryItem} />
            </Switch>
        )
    }

    const renderTopBarComponent = (): JSX.Element => (
        <TopBar />
    )

    return (
        <AdaptableMenu 
            selectedItem={getSelectedItem()} 
            items={items} 
            component={renderMainComponent()} 
            topBarComponent={renderTopBarComponent()}
        />
    )
}

export default Main