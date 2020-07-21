import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as ServiceWorker from './serviceWorker'
import AlertProvider from './provider/alert_provider'
import AppSettingsProvider from './provider/app_settings_provider'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'

ErrorHandlerService.register()

ReactDOM.render(
  <AlertProvider>
    <AppSettingsProvider>
      <App />
    </AppSettingsProvider>
  </AlertProvider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
