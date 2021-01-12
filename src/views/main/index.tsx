import React, { useState } from 'react'
import { useLanguage } from '../../context/language/index'
import { Switch } from 'react-router'
import PathConstants from '../../constants/app/PathConstants'
import DrawerNavigation from '../../components/drawer_navigation'
import PrivateRoute from '../../components/private_route'
import GlossaryItem from './glossary/glossary_item'
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
import AboutUs from './about'
import AuthService from '../../services/auth/AuthService'
import MenuService from '../../services/menu/MenuService'
import FirstSettingsDialog from '../../components/settings/first_settings_dialog'
import Loader from '../../components/loader/index'

const Main = () => {

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
    handleLogoutClick
  )

  const renderMainContent = (): JSX.Element => {
    return (
      <Switch>
        <PrivateRoute exact path={PathConstants.HOME} component={Home} />
        <PrivateRoute
          exact
          path={PathConstants.GAMES}
          component={() => <></>}
        />
        <PrivateRoute
          exact
          path={PathConstants.GLOSSARY}
          component={Glossary}
        />
        <PrivateRoute
          exact
          path={PathConstants.CONTACTS}
          component={Contacts}
        />
        <PrivateRoute
          exact
          path={PathConstants.NOTES}
          component={Notes}
        />
        <PrivateRoute
          exact
          path={PathConstants.SETTINGS}
          component={Settings}
        />
        <PrivateRoute
          path={`${PathConstants.GLOSSARY}/:localId`}
          component={GlossaryItem}
        />
        <PrivateRoute
          path={PathConstants.FAQ}
          component={() => (
            <Faq />
          )}
        />
        <PrivateRoute
          path={PathConstants.ABOUT_US}
          component={AboutUs}
        />
        <PrivateRoute path={PathConstants.CALENDAR} component={Calendar} />
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

export default Main
