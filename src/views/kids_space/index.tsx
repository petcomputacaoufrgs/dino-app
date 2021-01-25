import React from 'react'
import { Switch } from 'react-router'
import PrivateRoute from '../../components/private_route'
import PathConstants from '../../constants/app/PathConstants'
import NotFound from '../not_found'
import Dinogotchi from './dinogotchi'
import SnakeGame from './snake_game'
import './styles.css'

const KidsSpace: React.FC = () => {
    return(
			<Switch>
                <PrivateRoute exact path={PathConstants.KIDS_SPACE} component={Dinogotchi} />
                <PrivateRoute exact path={PathConstants.SNAKE_GAME} component={SnakeGame} />
				<PrivateRoute path={'/'} component={NotFound} />
			</Switch>
    )
}

export default KidsSpace