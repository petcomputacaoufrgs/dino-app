import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Login from './views/login'
import PrivateRoute from './components/private_route'
import PathConstants from './constants/PathConstants'

const App = () => (
    <div className='App'>
      <BrowserRouter>
        <PrivateRoute exact path={PathConstants.HOME}> oi </PrivateRoute>
        <PrivateRoute exact path={PathConstants.LOGIN} component={Login} />
      </BrowserRouter>
    </div> 
)

export default App
