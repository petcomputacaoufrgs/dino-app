import React from 'react'
import { Switch } from 'react-router'
import PrivateRoute from '../../components/private_route'
import PathConstants from '../../constants/app/PathConstants'
import NotFound from '../not_found'
import Dinogotchi from './dinogotchi'
import DinoRunner from './dino_runner'
import Menu from './menu'
import SnakeGame from './snake_game'
import MusicalDino from './musical_dino'
import './variables.css'

const KidsSpace: React.FC = () => {
	return (
		<Switch>
			<PrivateRoute
				exact
				path={PathConstants.KIDS_SPACE}
				component={Dinogotchi}
			/>
			<PrivateRoute exact path={PathConstants.GAME_MENU} component={Menu} />
			<PrivateRoute
				exact
				path={PathConstants.SNAKE_GAME}
				component={SnakeGame}
			/>
			<PrivateRoute
				exact
				path={PathConstants.DINO_RUNNER_GAME}
				component={DinoRunner}
			/>
			<PrivateRoute
				exact
				path={PathConstants.MUSICAL_DINO_GAME}
				component={MusicalDino}
			/>
			<PrivateRoute path={'/'} component={NotFound} />
		</Switch>
	)
}

export default KidsSpace
