import React, { useEffect, useState } from 'react'
import AuthService from './services/auth/AuthService'
import Login from './views/login'
import Main from './views/main'
import PrivateRouterContextProvider from './context_provider/private_router'
import PrivateRoute from './components/private_route'
import LoginRoute from './components/login_route/index'
import PathConstants from './constants/app/PathConstants'
import HistoryService from './services/history/HistoryService'
import { Switch, Route } from 'react-router'
import NotFound from './views/not_found/index'
import { useColorThemeName } from './context_provider/app_settings'
import EventService from './services/events/EventService'
import UserContextProvider from './context_provider/user'
import './App.css'
import Load from './views/load'

const LOAD_SCREEN_TIME = 2250

const App = (): JSX.Element => {
  const [firstLoad, setFirstLoad] = useState(true)
  const [showLoadScreen, setShowLoadScreen] = useState(true)

  const colorThemeName = useColorThemeName()

  useEffect(() => {
    if (firstLoad) {
      adjustViewport()
      setFirstLoad(false)
      EventService.whenStart()
    }
  }, [firstLoad])

  useEffect(() => {
    if (showLoadScreen) {
      const interval = setInterval(
        () => setShowLoadScreen(false),
        LOAD_SCREEN_TIME
      )
      const cleanBeforeUpdate = () => {
        clearInterval(interval)
      }

      return cleanBeforeUpdate
    }
  })

  const renderApp = (): JSX.Element => (
    <PrivateRouterContextProvider
      loginPath={PathConstants.LOGIN}
      homePath={PathConstants.HOME}
      isAuthenticated={AuthService.isAuthenticated}
      browserHistory={HistoryService}
    >
      <Switch>
        <LoginRoute exact path={PathConstants.LOGIN} component={Login} />
        <PrivateRoute
          path={PathConstants.APP}
          component={() => (
            <UserContextProvider>
              <Main />
            </UserContextProvider>
          )}
        />
        <Route path={'/'} component={NotFound} />
      </Switch>
    </PrivateRouterContextProvider>
  )

  const renderLoad = (): JSX.Element => (
    <Load />
  )

  return (
    <div className="app" data-theme={colorThemeName}>
      {showLoadScreen ? renderLoad() : renderApp()}
    </div>
  )
}

const adjustViewport = () => {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  let viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    viewport.setAttribute("content", "height=" + vh + ", width=" + vw + ", initial-scale=1.0");
  }
}

export default App
