import React from 'react'
import Login from './views/login'
import Main from './views/main'
import PrivateRoute from './components/private_route'
import PrivateRouter from './components/private_router'
import PathConstants from './constants/PathConstants'
import AuthService from './services/AuthService'
import HistoryService from './services/HistoryService';
import { Switch, Route } from 'react-router'


const App = (): JSX.Element => {
  return (
    <PrivateRouter 
      loginPath={PathConstants.LOGIN}
      homePath={PathConstants.HOME}
      isAuthenticated={AuthService.isAuthenticated()}
      browserHistory={HistoryService}>
      <Switch>
        <PrivateRoute path={PathConstants.APP} component={Main} />
        <PrivateRoute exact path={PathConstants.LOGIN} component={Login} />
        <Route path={'/'} component={() => <>NOT FOUND</>} />
      </Switch>
    </PrivateRouter>
  )
}



    


export default App
