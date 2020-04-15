import React from 'react'
import Login from './views/login'
import Main from './views/main'
import PrivateRouter from './components/private_router'
import PrivateRoute from './components/private_route'
import LoginRoute from './components/login_route/index'
import PathConstants from './constants/PathConstants'
import AuthService from './services/GoogleAuthService'
import HistoryService from './services/HistoryService'
import UpdateService from './services/UpdateService'
import { Switch, Route } from 'react-router'
import NotFound from './views/not_found/index'
import LanguageProvider from './components/language_provider'



const App = (): JSX.Element => {

  UpdateService.checkUpdates()

  return (
    <LanguageProvider>
      <PrivateRouter 
        loginPath={PathConstants.LOGIN}
        homePath={PathConstants.HOME}
        isAuthenticated={AuthService.isAuthenticated}
        browserHistory={HistoryService}>
        <Switch>
          <LoginRoute exact path={PathConstants.LOGIN} component={Login} />
          <PrivateRoute path={PathConstants.APP} component={Main} />
          <Route path={'/'} component={NotFound} />
        </Switch>
      </PrivateRouter>
    </LanguageProvider>
  )
}



    


export default App
