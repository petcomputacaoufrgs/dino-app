import React, { useEffect, useState } from 'react'
import AuthService from './services/auth/AuthService'
import Login from './views/login'
import Main from './views/main'
import PrivateRouter from './provider/private_router_provider'
import PrivateRoute from './components/private_route'
import LoginRoute from './components/login_route/index'
import PathConstants from './constants/PathConstants'
import HistoryService from './services/history/HistoryService'
import { Switch, Route } from 'react-router'
import NotFound from './views/not_found/index'
import ConnectionService from './services/connection/ConnectionService'
import { useLanguage } from './provider/app_settings_provider'
import { useAlert } from './provider/alert_provider'
import EventsService from './services/events/EventsService'
import './App.css'

const App = (): JSX.Element => {
  const [firstLoad, setFirstLoad] = useState(true)

  const alert = useAlert()
  const language = useLanguage()

  useEffect(() => {
    const updateConnectionState = (isConnected: boolean) => {
      if (isConnected) {
        alert.showSuccessAlert(language.current.CONNECTED_MESSAGE)
      } else {
        alert.showInfoAlert(language.current.DISCONNECTED_MESSAGE)
      }
    }

    ConnectionService.addEventListener(updateConnectionState)

    const cleanBeforeUpdate = () => {
      ConnectionService.removeEventListener(updateConnectionState)
    }

    return cleanBeforeUpdate
  }, [alert, language])

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false)
      EventsService.whenStart()
    }
  }, [language, firstLoad])

  return (
    <div className="app">
      <PrivateRouter
        loginPath={PathConstants.LOGIN}
        homePath={PathConstants.HOME}
        isAuthenticated={AuthService.isAuthenticated}
        browserHistory={HistoryService}
      >
        <Switch>
          <LoginRoute exact path={PathConstants.LOGIN} component={Login} />
          <PrivateRoute path={PathConstants.APP} component={Main} />
          <Route path={'/'} component={NotFound} />
        </Switch>
      </PrivateRouter>
    </div>
  )
}

export default App
