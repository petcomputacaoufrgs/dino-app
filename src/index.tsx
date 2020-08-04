import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import AlertProvider from './provider/alert_provider'
import AppSettingsProvider from './provider/app_settings_provider'

ReactDOM.render(
  <AlertProvider>
    <AppSettingsProvider>
      <App />
    </AppSettingsProvider>
  </AlertProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
