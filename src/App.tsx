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
import UpdaterService from './services/updater/UpdaterService'
import ConnectionListenerService from './services/connection/ConnectionListenerService'
import { useAlert, useLanguage } from './provider/app_provider/index'
import './App.css'
import SyncService from './services/sync/SyncService'
import SyncControlModel from './types/sync/SyncControlModel'

const App = (): JSX.Element => {
  const [first, setFirst] = useState(true)
  const languageContext = useLanguage()

  const alert = useAlert()
  const language = useLanguage()

  UpdaterService.checkUpdates(languageContext)

  useEffect(() => {
    const updateConnectionState = (isConnected: boolean) => {
      if (isConnected) {
        alert.showSuccessAlert(language.current.CONNECTED_MESSAGE)
      } else {
        alert.showInfoAlert(language.current.DISCONNECTED_MESSAGE)
      }
    }

    const onSyncStart = () => {
      alert.showInfoAlert(language.current.SYNC_STARTED)
    }

    const onSyncFinish = () => {
      alert.showSuccessAlert(language.current.SYNC_FINISH)
    }

    const onSyncFail = () => {
      alert.showWarningAlert(language.current.SYNC_FAIL)
    }

    const onInternetFail = () => {
      alert.showWarningAlert(language.current.SYNC_CONNECTION_FAIL)
    }

    SyncService.startSyncService({
      language: language,
      onFail: onSyncFail,
      onFinish: onSyncFinish,
      onStart: onSyncStart,
      onInternetFail: onInternetFail,
    } as SyncControlModel)

    if (first) {
      setFirst(false)
      SyncService.sync()
    }

    ConnectionListenerService.addEventListener(updateConnectionState)

    const cleanBeforeUpdate = () => {
      ConnectionListenerService.removeEventListener(updateConnectionState)
      SyncService.startSyncService({
        language: language,
        onFail: undefined,
        onFinish: undefined,
        onStart: undefined,
        onInternetFail: undefined,
      })
    }

    return cleanBeforeUpdate
  }, [first, language, alert])

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
