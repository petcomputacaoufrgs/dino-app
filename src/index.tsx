import React from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncProvider from './context/provider/sync'
import AlertProvider from './context/provider/alert'
import EventService from './services/events/EventService'
import GoogleOAuth2Provider from './context/provider/google_oauth2'
import AuthProvider from './context/provider/auth'
import App from './App'
import './Var.css'

ErrorHandlerService.register()
EventService.whenStart()

ReactDOM.render(
  <GoogleOAuth2Provider>
    <AuthProvider>
      <AlertProvider>
        <SyncProvider>
          <App />
        </SyncProvider>
      </AlertProvider>
    </AuthProvider>
  </GoogleOAuth2Provider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
