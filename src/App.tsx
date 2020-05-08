import React, { useEffect } from 'react'
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
import UpdaterService from './services/updater/UpdaterService'
import ConnectionListenerService from './services/connection/ConnectionListenerService'
import { useAlert, useLanguage } from './provider/app_provider/index'
import './App.css'

const App = (): JSX.Element => {
  const alert = useAlert()
  const language = useLanguage()

  UpdaterService.checkUpdates()

  const updateConnectionState = (isConnected: boolean) => {
    if (isConnected) {
      alert.showSuccessAlert(language.current.CONNECTED_MESSAGE)
    } else {
      alert.showInfoAlert(language.current.DISCONNECTED_MESSAGE)
    }
  }

  useEffect(() => {
    ConnectionListenerService.addEventListener(updateConnectionState)

    const removeListener = () => {
      ConnectionListenerService.removeEventListener(updateConnectionState)
    }

    return removeListener
  })

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
