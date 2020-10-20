import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as ServiceWorker from './serviceWorker'
import AlertContextProvider from './context_provider/alert'
import AppSettingsContextProvider from './context_provider/app_settings'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncContextProvider from './context_provider/sync'

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
