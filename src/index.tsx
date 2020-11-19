import React from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncContextProvider from './context_provider/sync'
import AlertContextProvider from './context_provider/alert'
import AppSettingsContextProvider from './context_provider/app_settings'
import EventService from './services/events/EventService'
import App from './App'
import './Var.css'
import GoogleAuth2ContextProvider from './context_provider/google_auth2'

ErrorHandlerService.register()
EventService.whenStart()

ReactDOM.render(
  <GoogleAuth2ContextProvider>
    <AlertContextProvider>
      <SyncContextProvider>
        <AppSettingsContextProvider>
          <App />
        </AppSettingsContextProvider>
      </SyncContextProvider>
    </AlertContextProvider>
  </GoogleAuth2ContextProvider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
