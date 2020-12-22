import React from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncContextProvider from './context/provider/sync'
import AlertContextProvider from './context/provider/alert'
import EventService from './services/events/EventService'
import GoogleOAuth2Provider from './context/provider/google_oauth2'
import App from './App'
import './Var.css'

ErrorHandlerService.register()
EventService.whenStart()

ReactDOM.render(
  <GoogleOAuth2Provider>
    <AlertContextProvider>
      <SyncContextProvider>
        <App />
      </SyncContextProvider>
    </AlertContextProvider>
  </GoogleOAuth2Provider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
