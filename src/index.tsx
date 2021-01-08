import React from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import AlertProvider from './context/alert'
import EventService from './services/events/EventService'
import GoogleOAuth2Provider from './context/google_oauth2'
import App from './App'
import LanguageProvider from './context/language'
import './Var.css'

window.addEventListener('load',() => {
  EventService.whenStart()
})

ReactDOM.render(
  <GoogleOAuth2Provider>
    <AlertProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AlertProvider>
  </GoogleOAuth2Provider>,
  document.getElementById('root')
)

ServiceWorker.unregister()
