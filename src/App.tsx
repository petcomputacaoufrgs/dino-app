import React, { useEffect, useState } from 'react'
import Login from './views/login'
import Main from './views/main'
import AuthProvider from './context/auth'
import LoginRoute from './components/route/login/index'
import PathConstants from './constants/app/PathConstants'
import HistoryService from './services/history/HistoryService'
import { Switch } from 'react-router'
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
import UserService from './services/user/UserService'
import ResponsibleAuthService from './services/auth/ResponsibleAuthService'
import ResponsibleRoute from './components/route/authenticated/responsible'
import KidsRoute from './components/route/authenticated/kids/index'
import './App.css'
import PublicRoute from './components/route/public'

const LOAD_SCREEN_TIME = 2250

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setAuthenticated] = useState(false)
	const [isResponsibleAuthenticated, setResponsibleAuthenticated] = useState(true)
	const [isFirstSettingsDone, setFirstSettingsDone] = useState(false)
	const [isKidsMode, setKidsMode] = useState(false)
	const [isMainTab, setIsMainTab] = useState(false)
	const [showLoadScreen, setShowLoadScreen] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			if (isLoading) await TabControlService.registerTab()

			const isAuthenticated = await loadAuth()

			await loadResponsibleAuth()

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

		const loadResponsibleAuth = async (): Promise<boolean> => {
			const isResponsibleAuthenticated = await ResponsibleAuthService.isAuthenticated()
			const isKidsMode = ResponsibleAuthService.isKidsMode()
			updateResponsibleAuth(isResponsibleAuthenticated, isKidsMode)
			return isResponsibleAuthenticated
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
			setAuthenticated(isAuthenticated)
		}

		let updateResponsibleAuth = (isAuthenticated: boolean, isKidsMode: boolean) => {
			setResponsibleAuthenticated(isAuthenticated)
			setKidsMode(isKidsMode)
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			const colorTheme = UserSettingsService.getColorThemeName(settings)
			DataThemeUtils.setBodyDataTheme(colorTheme)

			const fontSize = UserSettingsService.getFontSize(settings)
			DataFontSizeUtils.setBodyDataFontSize(fontSize)

			setFirstSettingsDone(settings.firstSettingsDone)
		}

		let updateTabInfo = (isMainTab: boolean) => {
			setIsMainTab(isMainTab)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserService.addUpdateEventListenner(loadData)
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
			updateResponsibleAuth = () => {}
			updateTabInfo = () => {}
			UserService.removeUpdateEventListenner(loadData)
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
		<AuthProvider
			loginPath={PathConstants.LOGIN}
			responsibleHomePath={PathConstants.RESPONSIBLE_HOME}
			kidsHomePath={PathConstants.KIDS_SPACE}
			isAuthenticated={isAuthenticated}
			isResponsibleAuthenticated={isResponsibleAuthenticated}
			isFirstSettingsDone={isFirstSettingsDone}
			isKidsMode={isKidsMode}
			browserHistory={HistoryService}
		>
			<Switch>
				<LoginRoute exact path={PathConstants.LOGIN} component={Login} />
				<ResponsibleRoute path={PathConstants.RESPONSIBLE} component={Main} />
				<KidsRoute path={PathConstants.KIDS_SPACE} component={KidsSpace} />
				<PublicRoute exact path={PathConstants.TERMS_OF_USE} component={TermsOfUse} />
				<PublicRoute
					exact
					path={PathConstants.PRIVACY_POLICY}
					component={PrivacyPolicy}
				/>
				<PublicRoute exact path={PathConstants.ABOUT_US} component={AboutUs} />
				<PublicRoute path={'/'} component={NotFound} />
			</Switch>
		</AuthProvider>
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
