import React from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncContextProvider from './context/provider/sync'
import AlertContextProvider from './context/provider/alert'
import AppSettingsContextProvider from './context/provider/app_settings'
import App from './App'
import './Var.css'

ErrorHandlerService.register()

ReactDOM.render(
  <AlertContextProvider>
    <SyncContextProvider>
      <AppSettingsContextProvider>
        <App />
      </AppSettingsContextProvider>
    </SyncContextProvider>
  </AlertContextProvider>,
  document.getElementById('root')
)
 
ServiceWorker.unregister()
