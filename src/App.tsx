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
import './app.css'

const LOAD_SCREEN_TIME = 2250

const App = (): JSX.Element => {
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [showLoadScreen, setShowLoadScreen] = useState(false)

	useEffect(() => {
		const loadData = async () => {
			const isAuthenticated = await AuthService.isAuthenticated()
			if (isAuthenticated) {
				await loadSettings()
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

		let updateSettings = (settings: UserSettingsEntity) => {
			const colorTheme = UserSettingsService.getColorThemeName(settings)
			DataThemeUtils.setBodyDataTheme(colorTheme)

			const fontSize = UserSettingsService.getFontSize(settings)
			DataFontSizeUtils.setBodyDataFontSize(fontSize)
		}

		let updateAuth = (isAuthenticated: boolean) => {
			setIsAuthenticated(isAuthenticated)
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

	const renderApp = (): JSX.Element => (
		<PrivateRouterContextProvider
			loginPath={PathConstants.LOGIN}
			homePath={PathConstants.HOME}
			isAuthenticated={isAuthenticated}
			browserHistory={HistoryService}
		>
			<Switch>
				<LoginRoute exact path={PathConstants.LOGIN} component={Login} />
				<PrivateRoute path={PathConstants.USER} component={() => <Main />} />
				<Route path={PathConstants.TERMS_OF_USE} component={TermsOfUse} />
				<Route path={PathConstants.PRIVACY_POLICY} component={PrivacyPolicy} />
				<Route path={PathConstants.ABOUT_US} component={AboutUs} />
				<Route path={'/'} component={NotFound} />
			</Switch>
		</PrivateRouterContextProvider>
	)

	const renderLoad = (): JSX.Element => <Load />

	return (
		<div className='app'>
			{showLoadScreen || isLoading ? renderLoad() : renderApp()}
		</div>
	)
}

export default App
