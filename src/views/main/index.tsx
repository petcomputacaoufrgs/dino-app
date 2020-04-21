import React, { useContext } from 'react'
import { useLocation, Switch } from 'react-router'
import { LanguageProviderContext } from '../../components/language_provider'
import GlossarySVG from '../../images/glossary.svg'
import GamesSVG from '../../images/games.svg'
import HomeSVG from '../../images/home.svg'
import SettingsSVG from '../../images/settings.svg'
import LogoutSVG from '../../images/logout.svg'
import AdaptableMenu from '../../components/adaptable_menu'
import PathConstants from '../../constants/PathConstants'
import PrivateRoute from '../../components/private_route'
import GlossaryItem from '../../components/glossary/glossary_item'
import Glossary from '../../components/glossary'
import Contacts from '../../components/contacts'
import TopBar from '../../components/top_bar'
import HistoryService from '../../services/HistoryService'
import Home from './home'
import Settings from './settings'
import LogoutDialog from '../../components/logout_dialog'
import MenuItem from '../../types/MenuItem'

/**
 * @description Tela principal da aplicação
 * @returns Elemento JSX com a tela principal do aplicativo
 **/
const Main = (): JSX.Element => {

    const location = useLocation()

    const languageContext = useContext(LanguageProviderContext)

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
    const goToContacts = () => {
        HistoryService.push(PathConstants.CONTACTS)
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
                'name': languageContext.MENU_HOME,
                'onClick': goToHome,
            },
            {
                'image': GamesSVG,
                'name': languageContext.MENU_GAMES,
                'onClick': goToGames,
            },
            {
                'image': GlossarySVG,
                'name': languageContext.MENU_GLOSSARY,
                'onClick': goToGlossary,
            },
            {
                'image': GlossarySVG,
                'name': languageContext.MENU_CONTACTS,
                'onClick': goToContacts,
            }
        ],
        [
            {
                'image': SettingsSVG,
                'name': languageContext.MENU_SETTINGS,
                'onClick': goToSettings,
            },
        ],
        [
            {
                'image': LogoutSVG,
                'name': languageContext.MENU_LOGOUT,
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
        return (
            <Switch>
                <PrivateRoute exact path={PathConstants.HOME} component={Home} />
                <PrivateRoute exact path={PathConstants.GAMES} component={() => <>GAMES</>} />
                <PrivateRoute exact path={PathConstants.GLOSSARY} component={Glossary} />
                <PrivateRoute exact path={PathConstants.CONTACTS} component={Contacts} />
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