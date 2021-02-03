import React, { useState } from 'react'
import { useLanguage } from '../../context/language/index'
import { Switch } from 'react-router'
import PathConstants from '../../constants/app/PathConstants'
import DrawerNavigation from '../../components/drawer_navigation'
import PrivateRoute from '../../components/private_route'
import GlossaryItem from './glossary/glossary_items/glossary_item'
import Glossary from './glossary'
import Contacts from './contacts'
import Home from './home'
import Settings from './settings'
import LogoutDialog from '../../components/logout_dialog'
import Notes from './notes'
import NotFound from '../not_found/index'
import Faq from './faq'
import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import Calendar from './calendar'
import AuthService from '../../services/auth/AuthService'
import MenuService from '../../services/menu/MenuService'
import FirstSettingsDialog from '../../components/settings/first_settings_dialog'
import DinoLoader from '../../components/loader/index'

const Main: React.FC = () => {
	const language = useLanguage()

	const [openLogoutDialog, setOpenLogoutDialog] = useState(false)

	const handleLogoutClick = () => {
		setOpenLogoutDialog(true)
	}

	const handleLogoutAgree = () => {
		AuthService.logout()
	}

	const handleLogoutDisagree = () => {
		setOpenLogoutDialog(false)
	}

	const groupedItems: MenuItemViewModel[][] = MenuService.getGroupedMenuItems(
		language.data,
		handleLogoutClick,
	)

	const renderMainContent = (): JSX.Element => {
		return (
			<Switch>
				<PrivateRoute exact path={PathConstants.USER_HOME} component={Home} />
				<PrivateRoute
					exact
					path={PathConstants.USER_GAMES}
					component={() => <></>}
				/>
				<PrivateRoute
					exact
					path={PathConstants.USER_GLOSSARY}
					component={Glossary}
				/>
				<PrivateRoute
					exact
					path={PathConstants.USER_CONTACTS}
					component={Contacts}
				/>
				<PrivateRoute exact path={PathConstants.USER_NOTES} component={Notes} />
				<PrivateRoute
					exact
					path={PathConstants.USER_SETTINGS}
					component={Settings}
				/>
				<PrivateRoute
					path={`${PathConstants.USER_GLOSSARY}/:localId`}
					component={GlossaryItem}
				/>
				<PrivateRoute path={PathConstants.USER_FAQ} component={Faq} />
				<PrivateRoute path={PathConstants.USER_CALENDAR} component={Calendar} />
				<PrivateRoute path={'/'} component={NotFound} />
			</Switch>
		)
	}
	return (
		<DinoLoader isLoading={language.loading} hideChildren>
			<DrawerNavigation
				groupedItems={groupedItems}
				component={renderMainContent()}
			/>
			<LogoutDialog
				onAgree={handleLogoutAgree}
				onDisagree={handleLogoutDisagree}
				open={openLogoutDialog}
			/>
			<FirstSettingsDialog />
		</DinoLoader>
	)
}

export default Main
