import React, { useState } from 'react'
import AuthService from '../../services/auth/AuthService'
import FirstSettingsDialog from '../../components/settings/first_settings_dialog'
import DinoLoader from '../../components/loader/index'
import DrawerNavigation from '../../components/drawer_navigation'
import LogoutDialog from '../../components/logout_dialog'
import { useLanguage } from '../../context/language/index'
import { IsStaff } from '../../context/private_router'
import MenuService from '../../services/menu/MenuService'
import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import LanguageBase from '../../constants/languages/LanguageBase'
import { toggle } from '../../constants/toggle/Toggle'

type getGroupedItemsType = (language: LanguageBase, handleLogoutClick: () => void) => MenuItemViewModel[][]

const Main: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isStaff = IsStaff()

  const language = useLanguage()

  const getGroupedItems = (): MenuItemViewModel[][] => {

    const searchGroupedItems = (getItems: getGroupedItemsType) => getItems(language.data, handleLogoutClick)
    
		return searchGroupedItems(isStaff ? MenuService.getStaffGroupedMenuItems : MenuService.getGroupedMenuItems) 
	}

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
  
  return (
    <DinoLoader isLoading={language.loading} hideChildren>
      <DrawerNavigation
        groupedItems={getGroupedItems()}
        component={children}
      />
      <LogoutDialog
        onAgree={handleLogoutAgree}
        onDisagree={handleLogoutDisagree}
        open={openLogoutDialog}
      />
      {toggle.firstLoginDialog && <FirstSettingsDialog />}
    </DinoLoader>
  )
}

export default Main