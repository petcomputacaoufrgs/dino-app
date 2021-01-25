import React, { useEffect, useState } from 'react'
import Login from './views/login'
import Main from './views/main'
import PrivateRouterContextProvider from './context/private_router'
import PrivateRoute from './components/private_route'
import LoginRoute from './components/login_route/index'
import PathConstants from './constants/app/PathConstants'
import HistoryService from './services/history/HistoryService'
import { Switch, Route } from 'react-router'
import NotFound from './views/not_found/index'
import Load from './views/load'
import ViewportService from './services/viewport/ViewportService'
import TermsOfUse from './views/terms_of_use'
import PrivacyPolicy from './views/privacy_policy'
import DataThemeUtils from './utils/DataThemeUtils'
import UserSettingsService from './services/user/UserSettingsService'
import UserSettingsEntity from './types/user/database/UserSettingsEntity'
import DataFontSizeUtils from './utils/DataFontSizeUtils'
import AuthService from './services/auth/AuthService'
import AboutUs from './views/about'
import './App.css'
import UserService from './services/user/UserService'
import UserEnum from './types/enum/UserEnum'
import StaffMain from './views/staff_main'

const LOAD_SCREEN_TIME = 2250

const App = (): JSX.Element => {
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [showLoadScreen, setShowLoadScreen] = useState(false)
	const [userPermission, setUserPermission] = useState<number | undefined>(undefined)

	useEffect(() => {
		const loadData = async () => {
			const isAuthenticated = await AuthService.isAuthenticated()
			if (isAuthenticated) {
				await loadSettings()
				await loadUserPermission()
			} else {
				DataThemeUtils.setBodyDataTheme(
					UserSettingsService.getSystemColorThemeName(),
				)
			}
			updateAuth(isAuthenticated)
			
			finishLoading()
		}

		const loadSettings = async () => {
			const dbSettings = await UserSettingsService.getFirst()
			if (dbSettings) {
				updateSettings(dbSettings)
			} else {
				DataThemeUtils.setBodyDataTheme(
					UserSettingsService.getSystemColorThemeName(),
				)
			}
		}

		const loadUserPermission = async () => {
			const hasUserPermission = await UserService.getPermission()
			const user = await UserService.getFirst()
      updateUserPermission(hasUserPermission || UserEnum.USER)
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			const colorTheme = UserSettingsService.getColorThemeName(settings)
			DataThemeUtils.setBodyDataTheme(colorTheme)

			const fontSize = UserSettingsService.getFontSize(settings)
			DataFontSizeUtils.setBodyDataFontSize(fontSize)
		}

		let updateAuth = (isAuthenticated: boolean) => {
			setIsAuthenticated(isAuthenticated)
		}

		let updateUserPermission = (userPermission: number) => {
         setUserPermission(userPermission)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadSettings)
		AuthService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			finishLoading = () => {}
			updateSettings = () => {}
			updateAuth = () => {}
			updateUserPermission = () => {}
			UserSettingsService.removeUpdateEventListenner(loadSettings)
			AuthService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	useEffect(() => {
		if (showLoadScreen) {
			const interval = setInterval(
				() => setShowLoadScreen(false),
				LOAD_SCREEN_TIME,
			)
			const cleanBeforeUpdate = () => {
				clearInterval(interval)
			}

			return cleanBeforeUpdate
		}
	}, [showLoadScreen])

	useEffect(() => {
		ViewportService.maximizeViewport()
	}, [])

	const renderApp = () => (
		<PrivateRouterContextProvider
			loginPath={PathConstants.LOGIN}
			userHomePath={PathConstants.USER_HOME}
			staffHomePath={PathConstants.STAFF_HOME}
			isAuthenticated={isAuthenticated}
			browserHistory={HistoryService}
			userPermission={userPermission}
		>
			<Switch>
				<LoginRoute exact path={PathConstants.LOGIN} component={Login} />
				<PrivateRoute 
					path={PathConstants.USER} 
					component={Main} 
					restrictedTo={[UserEnum.USER, UserEnum.ADMIN]} 
        />
				<PrivateRoute 
					path={PathConstants.STAFF} 
					component={StaffMain} 
					restrictedTo={[UserEnum.STAFF]} 
				/>
				<Route path={PathConstants.TERMS_OF_USE} component={TermsOfUse} />
				<Route path={PathConstants.PRIVACY_POLICY} component={PrivacyPolicy} />
				<Route path={PathConstants.ABOUT_US} component={AboutUs} />
				<Route path={'/'} component={NotFound} />
			</Switch>
		</PrivateRouterContextProvider>
	)

	const renderLoad = () => <Load />

	return (
		<div className='app'>
			{showLoadScreen || isLoading ? renderLoad() : renderApp()}
		</div>
	)
}

export default App
