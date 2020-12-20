import React, { useEffect, useState } from 'react'
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
import NoteContextProvider from '../../context/provider/note'
import GlossaryProvider from '../../context/provider/glossary'
import ContactProvider from '../../context/provider/contact'
import NoteColumnProvider from '../../context/provider/note_column'
import PhoneProvider from '../../context/provider/phone'
import GoogleContactProvider from '../../context/provider/google_contact'
import Faq from './faq'
import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import Calendar from './calendar'
import AboutUs from './about'
import AuthService from '../../services/auth/AuthService'
import MenuService from '../../services/menu/MenuService'
import FaqProvider from '../../context/provider/faq'
import FaqItemProvider from '../../context/provider/faq_item'
import FaqUserQuestionProvider from '../../context/provider/faq_user_question'
import FirstSettingsDialog from './first_settings_dialog'
import { useUserSettings } from '../../context/provider/user_settings'
import DataThemeUtils from '../../utils/DataThemeUtils'
import DataFontSizeUtils from '../../utils/DataFontSizeUtils'

const Main = (): JSX.Element => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const firstSettingsDone = userSettings.service.getFirstSettingsDone(userSettings)

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false)
  
  const colorThemeName = userSettings.service.getColorTheme(userSettings)

  DataThemeUtils.setBodyDataTheme(colorThemeName)

  const fontSizeName = userSettings.service.getFontSize(userSettings)
  DataFontSizeUtils.setBodyDataFontSize(fontSizeName)

  useEffect(() => {
    DataThemeUtils.setBodyDataTheme(colorThemeName)
  }, [colorThemeName])

  useEffect(() => {
    DataFontSizeUtils.setBodyDataFontSize(fontSizeName)
  }, [fontSizeName])
  
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
    language,
    handleLogoutClick
  )

  const renderMainContent = (): JSX.Element => {
    return (
      <Switch>
        <PrivateRoute 
          exact 
          path={PathConstants.HOME} 
          component={Home} />
        <PrivateRoute
          exact
          path={PathConstants.GAMES}
          component={() => <></>}
        />
        <PrivateRoute
          exact
          path={PathConstants.GLOSSARY}
          component={() => (
            <GlossaryProvider>
              <Glossary />
            </GlossaryProvider>
          )}
        />
        <PrivateRoute
          exact
          path={PathConstants.CONTACTS}
          component={() => (
            <ContactProvider>
              <PhoneProvider>
                <GoogleContactProvider>
                  <Contacts />
                </GoogleContactProvider>
              </PhoneProvider>
            </ContactProvider>
          )}
        />
        <PrivateRoute
          exact
          path={PathConstants.NOTES}
          component={() => (
            <NoteColumnProvider>
              <NoteContextProvider>
                <Notes />
              </NoteContextProvider>
            </NoteColumnProvider>
          )}
        />
        <PrivateRoute
          exact
          path={PathConstants.SETTINGS}
          component={() => (
            <FaqProvider>
              <Settings/>
            </FaqProvider>
          )}
        />
        <PrivateRoute
          path={`${PathConstants.GLOSSARY}/:id`}
          component={() => (
            <GlossaryProvider>
              <GlossaryItem />
            </GlossaryProvider>
          )}
        />
        <PrivateRoute
          path={PathConstants.FAQ}
          component={() => (
            <FaqProvider>
              <FaqItemProvider>
                <FaqUserQuestionProvider>
                  <Faq />
                </FaqUserQuestionProvider>
              </FaqItemProvider>
            </FaqProvider>
          )}
        />
        <PrivateRoute
          path={PathConstants.ABOUT_US}
          component={() => <AboutUs />}
        />
        <PrivateRoute path={PathConstants.CALENDAR} component={Calendar} />
        <PrivateRoute path={'/'} component={NotFound} />
      </Switch>
    )
  }

  return (
    <>
      <DrawerNavigation
        groupedItems={groupedItems}
        component={renderMainContent()}
      />
      <LogoutDialog
        onAgree={handleLogoutAgree}
        onDisagree={handleLogoutDisagree}
        open={openLogoutDialog}
      />
      {!firstSettingsDone && <FirstSettingsDialog/>}
    </>
  )
}

export default Main
