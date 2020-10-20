import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import * as ServiceWorker from './serviceWorker'
import ErrorHandlerService from './services/error_handler/ErrorHandlerService'
import SyncContextProvider from './context_provider/sync'
import Load from './views/load'

const AlertContextProvider = React.lazy(() =>
  import('./context_provider/alert')
)

const AppSettingsContextProvider = React.lazy(() =>
  import('./context_provider/app_settings')
)

const App = React.lazy(async () => {
  const [moduleExports] = await Promise.all([
    import('./App'),
    new Promise((resolve) => setTimeout(resolve, 2250)),
  ])
  return moduleExports as {
    default: React.ComponentType<any>
  }
})

ErrorHandlerService.register()

ReactDOM.render(
  <Suspense fallback={<Load />}>
    <AlertContextProvider>
      <SyncContextProvider>
        <AppSettingsContextProvider>
          <App />
        </AppSettingsContextProvider>
      </SyncContextProvider>
    </AlertContextProvider>
  </Suspense>,
  document.getElementById('root')
)
 
ServiceWorker.unregister()
