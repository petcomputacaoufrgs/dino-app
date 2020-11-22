import React from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncContextProvider from './context_provider/sync'
import AlertContextProvider from './context_provider/alert'
import AppSettingsContextProvider from './context_provider/app_settings'
import App from './App'
import './Var.css'
import GoogleOAuth2ContextProvider from './context_provider/google_oauth2'
import EventService from './services/events/EventService'

ErrorHandlerService.register()
EventService.whenStart()

ReactDOM.render(
  <GoogleOAuth2ContextProvider>
    <AlertContextProvider>
      <SyncContextProvider>
        <AppSettingsContextProvider>
          <App />
        </AppSettingsContextProvider>
      </SyncContextProvider>
    </AlertContextProvider>
  </GoogleOAuth2ContextProvider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
