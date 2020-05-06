import React from 'react'
import { useLocation, Switch } from 'react-router'
import { useLanguage } from '../../provider/app_provider'
import GlossarySVG from '../../images/glossary.svg'
import ContactsSVG from '../../images/phone.svg'
import GamesSVG from '../../images/games.svg'
import HomeSVG from '../../images/home.svg'
import NotesSVG from '../../images/note.svg'
import SettingsSVG from '../../images/settings.svg'
import LogoutSVG from '../../images/logout.svg'
import AdaptableMenu from '../../components/menu/adaptable_menu'
import PathConstants from '../../constants/PathConstants'
import PrivateRoute from '../../components/private_route'
import GlossaryItem from './glossary/glossary_item'
import Glossary from './glossary'
import Contacts from '../../components/contacts'
import TopBar from '../../components/top_bar'
import HistoryService from '../../services/HistoryService'
import Home from './home'
import Settings from './settings'
import LogoutDialog from '../../components/logout_dialog'
import MenuItemViewModel from '../../model/view/MenuItemViewModel'
import Notes from './notes'
import NotFound from '../not_found/index'

/**
 * @description Tela principal da aplicação
 * @returns Elemento JSX com a tela principal do aplicativo
 **/
const Main = (): JSX.Element => {

    const location = useLocation()

    const language = useLanguage().currentLanguage

    const [LogoutDialogElement, showLogoutDialog] = LogoutDialog()

    /** Itens do menu */
    const groupedItems: MenuItemViewModel[][] = [
        [
            {
                'image': HomeSVG,
                'name': language.MENU_HOME,
                'onClick': () =>  HistoryService.push(PathConstants.HOME),
            },
            {
                'image': GamesSVG,
                'name': language.MENU_GAMES,
                'onClick': () => HistoryService.push(PathConstants.GAMES),
            },
            {
                'image': GlossarySVG,
                'name': language.MENU_GLOSSARY,
                'onClick': () => HistoryService.push(PathConstants.GLOSSARY),
            },
            {
                'image': ContactsSVG,
                'name': language.MENU_CONTACTS,
                'onClick':  () => HistoryService.push(PathConstants.CONTACTS),
            }
        ],
        [
            {
                'image': NotesSVG,
                'name': language.MENU_NOTES,
                'onClick': () => HistoryService.push(PathConstants.NOTES),    
            },
        ],
        [
            {
                'image': SettingsSVG,
                'name': language.MENU_SETTINGS,
                'onClick': () => HistoryService.push(PathConstants.SETTINGS),
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
        } else if (location.pathname.includes(PathConstants.CONTACTS)) {
            return 3
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
                <PrivateRoute exact path={PathConstants.GAMES} component={() => <></>} />
                <PrivateRoute exact path={PathConstants.GLOSSARY} component={Glossary} />
                <PrivateRoute exact path={PathConstants.CONTACTS} component={Contacts} />
                <PrivateRoute exact path={PathConstants.NOTES} component={Notes} /> 
                <PrivateRoute exact path={PathConstants.SETTINGS} component={Settings} />
                <PrivateRoute path={`${PathConstants.GLOSSARY}/:id`} component={GlossaryItem} />
                <PrivateRoute path={'/'} component={NotFound} />
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