import React from 'react'
import { Router } from 'react-router-dom'
import Login from './views/login'
import Main from './views/main'
import PrivateRoute from './components/private_route'
import PathConstants from './constants/PathConstants'
import history from './services/HistoryService'

const App = () => (
    <div className='App'>
      <Router history = { history }>
        <PrivateRoute exact path={PathConstants.HOME} component={Main} /> 
        <PrivateRoute exact path={PathConstants.LOGIN} component={Login} />
      </Router>
    </div> 
)

export default App
