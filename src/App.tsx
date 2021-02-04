import React, { useEffect, useState } from 'react'
import Login from './views/login'
import Main from './views/main'
import PrivateRouterProvider from './context/private_router'
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
import TabControlService from './services/tab_control/TabControlService'
import SecondaryTab from './views/secondary_tab'
import PWAControl from './components/pwa_control'
import KidsSpace from './views/kids_space'
import './App.css'

const LOAD_SCREEN_TIME = 2250

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isMainTab, setIsMainTab] = useState(false)
	const [showLoadScreen, setShowLoadScreen] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			if (isLoading) await TabControlService.registerTab()

			const isAuthenticated = await loadAuth()

			if (isAuthenticated) {
				await loadSettings()
			} else {
				DataThemeUtils.setBodyDataTheme(
					UserSettingsService.getSystemColorThemeName(),
				)
			}

			await loadTabInfo()
			finishLoading()
		}

		const loadAuth = async (): Promise<boolean> => {
			const isAuthenticated = await AuthService.isAuthenticated()
			updateAuth(isAuthenticated)
			return isAuthenticated
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

		const loadTabInfo = async () => {
			const isMainTab = await TabControlService.isMainTab()
			updateTabInfo(isMainTab)
		}

		let updateAuth = (isAuthenticated: boolean) => {
			setIsAuthenticated(isAuthenticated)
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			const colorTheme = UserSettingsService.getColorThemeName(settings)
			DataThemeUtils.setBodyDataTheme(colorTheme)

			const fontSize = UserSettingsService.getFontSize(settings)
			DataFontSizeUtils.setBodyDataFontSize(fontSize)
		}

		let updateTabInfo = (isMainTab: boolean) => {
			setIsMainTab(isMainTab)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		AuthService.addUpdateEventListenner(loadData)
		UserSettingsService.addUpdateEventListenner(loadSettings)
		TabControlService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			finishLoading = () => {}
			updateSettings = () => {}
			updateAuth = () => {}
			updateTabInfo = () => {}
			AuthService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadSettings)
			TabControlService.removeUpdateEventListenner(loadTabInfo)
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

	const renderApp = (): JSX.Element => (
		<PrivateRouterProvider
			loginPath={PathConstants.LOGIN}
			homePath={PathConstants.HOME}
			isAuthenticated={isAuthenticated}
			browserHistory={HistoryService}
		>
			<Switch>
				<LoginRoute exact path={PathConstants.LOGIN} component={Login} />
				<PrivateRoute path={PathConstants.USER} component={Main} />
				<PrivateRoute path={PathConstants.KIDS_SPACE} component={KidsSpace} />
				<Route exact path={PathConstants.TERMS_OF_USE} component={TermsOfUse} />
				<Route
					exact
					path={PathConstants.PRIVACY_POLICY}
					component={PrivacyPolicy}
				/>
				<Route exact path={PathConstants.ABOUT_US} component={AboutUs} />
				<Route path={'/'} component={NotFound} />
			</Switch>
		</PrivateRouterProvider>
	)

	return (
		<div className='app'>
			{showLoadScreen || isLoading ? (
				<Load />
			) : isMainTab ? (
				renderApp()
			) : (
				<SecondaryTab />
			)}
			<PWAControl />
		</div>
	)
}

export default App
