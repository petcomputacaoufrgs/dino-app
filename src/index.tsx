import React from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncContextProvider from './context/provider/sync'
import AlertContextProvider from './context/provider/alert'
import EventService from './services/events/EventService'
import GoogleOAuth2ContextProvider from './context/provider/google_oauth2'
import App from './App'
import './Var.css'

ErrorHandlerService.register()
EventService.whenStart()

ReactDOM.render(
  <GoogleOAuth2ContextProvider>
    <AlertContextProvider>
      <SyncContextProvider>
        <App />
      </SyncContextProvider>
    </AlertContextProvider>
  </GoogleOAuth2ContextProvider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
