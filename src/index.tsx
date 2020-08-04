import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as ServiceWorker from './serviceWorker'
import AlertContextProvider from './context_provider/alert'
import AppSettingsContextProvider from './context_provider/app_settings'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'

ErrorHandlerService.register()

ReactDOM.render(
  <AlertContextProvider>
    <AppSettingsContextProvider>
      <App />
    </AppSettingsContextProvider>
  </AlertContextProvider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
