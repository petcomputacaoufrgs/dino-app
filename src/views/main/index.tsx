import React, { useState } from 'react'
import { useLanguage } from '../../context/language'
import { Route, Switch } from 'react-router'
import PathConstants from '../../constants/app/PathConstants'
import DrawerNavigation from '../../components/drawer_navigation'
import GlossaryItem from './glossary/glossary_item'
import Glossary from './glossary'
import Contacts from './contacts'
import Home from './home'
import Settings from './settings'
import LogoutDialog from '../../components/logout_dialog'
import Notes from './notes'
import NotFound from '../not_found'
import Faq from './faq'
import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import Calendar from './calendar'
import AuthService from '../../services/auth/AuthService'
import MenuService from '../../services/menu/MenuService'
import FirstSettingsDialog from '../../components/settings/first_settings_dialog'
import Loader from '../../components/loader'
import './styles.css'

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

	const menuItems: MenuItemViewModel[][] = MenuService.getMenuItems(
		language.data,
		handleLogoutClick,
	)

	const renderMainContent = (): JSX.Element => {
		return (
			<Switch>
				<Route exact path={PathConstants.RESPONSIBLE_HOME} component={Home} />
				<Route
					exact
					path={PathConstants.GLOSSARY}
					component={Glossary}
				/>
				<Route
					exact
					path={PathConstants.CONTACTS}
					component={Contacts}
				/>
				<Route exact path={PathConstants.NOTES} component={Notes} />
				<Route
					exact
					path={PathConstants.SETTINGS}
					component={Settings}
				/>
				<Route
					path={`${PathConstants.GLOSSARY}/:localId`}
					component={GlossaryItem}
				/>
				<Route path={PathConstants.FAQ} component={Faq} />
				<Route path={PathConstants.CALENDAR} component={Calendar} />
				<Route path={'/'} component={NotFound} />
			</Switch>
		)
	}
	return (
		<Loader className='responsible_loader' isLoading={language.loading} hideChildren>
			<DrawerNavigation
				items={menuItems}
				component={renderMainContent()}
			/>
			<LogoutDialog
				onAgree={handleLogoutAgree}
				onDisagree={handleLogoutDisagree}
				open={openLogoutDialog}
			/>
			<FirstSettingsDialog />
		</Loader>
	)
}

export default Main
