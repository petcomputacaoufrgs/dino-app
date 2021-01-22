import React, { useState } from 'react'
import { useLanguage } from '../../context/language/index'
import { Switch } from 'react-router'
import PathConstants from '../../constants/app/PathConstants'
import DrawerNavigation from '../../components/drawer_navigation'
import PrivateRoute from '../../components/private_route'
import AuthService from '../../services/auth/AuthService'
import MenuService from '../../services/menu/MenuService'
import FirstSettingsDialog from '../../components/settings/first_settings_dialog'
import Loader from '../../components/loader/index'
import LogoutDialog from '../../components/logout_dialog'
import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import NotFound from '../not_found'

const StaffMain: React.FC = () => {
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
				<PrivateRoute exact path={PathConstants.STAFF_HOME} component={() => <> </>} />
				<PrivateRoute
					exact
					path={PathConstants.STAFF_GLOSSARY}
					component={() => <> </>}//Glossary}
				/>
				<PrivateRoute
					exact
					path={PathConstants.STAFF_CONTACTS}
					component={() => <> </>}//Contacts}
				/>
				<PrivateRoute
					exact
					path={PathConstants.STAFF_SETTINGS}
					component={() => <> </>}//Settings}
				/>
				<PrivateRoute
					path={`${PathConstants.STAFF_GLOSSARY}/:localId`}
					component={() => <> </>}//GlossaryItem}
				/>
				<PrivateRoute path={PathConstants.STAFF_FAQ} component={() => <> </>} />
				<PrivateRoute path={'/'} component={NotFound} />
			</Switch>
		)
	}
	return (
		<Loader isLoading={language.loading} hideChildren>
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
		</Loader>
	)
}

export default StaffMain
