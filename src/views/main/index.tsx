import React, { useContext } from 'react'
import { useLocation, Switch } from 'react-router'
import { LanguageContext } from '../../components/language_provider'
import GlossarySVG from '../../images/glossary.svg'
import GamesSVG from '../../images/games.svg'
import HomeSVG from '../../images/home.svg'
import SettingsSVG from '../../images/settings.svg'
import LogoutSVG from '../../images/logout.svg'
import AdaptableMenu from '../../components/adaptable_menu'
import PathConstants from '../../constants/PathConstants'
import PrivateRoute from '../../components/private_route'
import GlossaryItem from '../../components/glossary/glossary_item'
import GlossarySearchBar from '../../components/glossary/glossary_search'
import TopBar from '../../components/top_bar'
import HistoryService from '../../services/HistoryService'
import Home from './home'
import Settings from './settings'
import LogoutDialog from '../../components/logout_dialog'
import MenuItem from '../../types/MenuItem'
import Notes from './notes'

/**
 * @description Tela principal da aplicação
 * @returns Elemento JSX com a tela principal do aplicativo
 **/
const Main = () : JSX.Element => {

    const location = useLocation()

    const languageProvider = useContext(LanguageContext)

    const language = languageProvider.currentLanguage

    /**
     * @description Função chamada quando seu item for selecionado no menu
     */
    const goToHome = () => {
        HistoryService.push(PathConstants.HOME)
    }

    /**
     * @description Função chamada quando seu item for selecionado no menu
     */
    const goToGames = () => {
        HistoryService.push(PathConstants.GAMES)
    }

    /**
     * @description Função chamada quando seu item for selecionado no menu
     */
    const goToGlossary = () => {
        HistoryService.push(PathConstants.GLOSSARY)
    }

    /**
     * @description Função chamada quando seu item for selecionado no menu
     */
    const goToSettings = () => {
        HistoryService.push(PathConstants.SETTINGS)
    }

    const [LogoutDialogElement, showLogoutDialog] = LogoutDialog()

    /** Itens do menu */
    const groupedItems: MenuItem[][] = [
        [
            {
                'image': HomeSVG,
                'name': language.MENU_HOME,
                'onClick': goToHome,
            },
            {
                'image': GamesSVG,
                'name': language.MENU_GAMES,
                'onClick': goToGames,
            },
            {
                'image':GlossarySVG,
                'name': language.MENU_GLOSSARY,
                'onClick': goToGlossary,
            }
        ],
        [
            {
                'image': SettingsSVG,
                'name': language.MENU_SETTINGS,
                'onClick': goToSettings,
            },
        ],
        [
            {
                'image': LogoutSVG,
                'name': language.MENU_LOGOUT,
                'onClick': showLogoutDialog,            
            },
        ]
    ]

    const getSelectedItem = (): number => {
        if (location.pathname === PathConstants.GAMES) {
            return 1
        } else if (location.pathname.includes(PathConstants.GLOSSARY)) {
            return 2
        } else if (location.pathname === PathConstants.HOME) {
            return 0
        } else {
            return -1
        }
    }
    
    const renderMainContent = (): JSX.Element => {
        return(
            <Switch>
                <PrivateRoute exact path={PathConstants.HOME} component={Home} />
                <PrivateRoute exact path={PathConstants.GAMES} component={() => <Notes/>} />
                <PrivateRoute exact path={PathConstants.GLOSSARY} component={GlossarySearchBar} />
                <PrivateRoute exact path={PathConstants.SETTINGS} component={Settings} />
                <PrivateRoute path={`${PathConstants.GLOSSARY}/:id`} component={GlossaryItem} />
            </Switch>
        )
    }

    return (
        <>
            <AdaptableMenu 
                selectedItem={getSelectedItem()} 
                groupedItems={groupedItems} 
                component={renderMainContent()} 
                topBarComponent={<TopBar />}
            />
            <LogoutDialogElement />
        </>
    )
}

export default Main