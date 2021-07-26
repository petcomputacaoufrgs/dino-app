import React from 'react'
import './styles.css'
import {  ReactComponent as HealthStatus} from '../../assets/new/game_elements/saude.svg'
import {  ReactComponent as EnergyStatus} from '../../assets/new/game_elements/energia.svg'
import {  ReactComponent as HappinessStatus} from '../../assets/new/game_elements/felicidade.svg'

const StatusIndicator: React.FC = () => {

	return (
        <div className='status_wrapper dino__flex_row'>
            <div className='status_item'>
                <div className='status_bg status_health'></div>
                <HealthStatus />
                
            </div>
            <div className='status_item'>
                <div className='status_bg status_energy'></div>
                <EnergyStatus />
            </div>
            <div className='status_item'>
                <div className='status_bg status_happiness'></div>
                <HappinessStatus />
            </div>
        </div>
	)
}

export default StatusIndicator
