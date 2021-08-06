import React from 'react'
import './styles.css'
import { ReactComponent as HealthStatus } from '../../assets/new/game_elements/saude.svg'
import { ReactComponent as EnergyStatus } from '../../assets/new/game_elements/energia.svg'
import { ReactComponent as HappinessStatus } from '../../assets/new/game_elements/felicidade.svg'

interface StatusIndicatorProps {
    fillHealth: number,
    fillEnergy: number,
    fillHappiness: number
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ fillHealth, fillEnergy, fillHappiness }) => {

    return (
        <div className='status_wrapper dino__flex_row'>
            <div className='status_item'>
                <div className='status_bg status_health' style={{backgroundImage: `linear-gradient(to bottom, transparent ${100 - fillHealth}%, #FF6961 0% ${fillHealth}%)`}}></div>
                <HealthStatus />

            </div>
            <div className='status_item'>
                <div className='status_bg status_energy' style={{backgroundImage: `linear-gradient(to bottom, transparent ${100 - fillEnergy}%, #00db52 0% ${fillEnergy}%)`}}></div>
                <EnergyStatus />
            </div>
            <div className='status_item'>
                <div className='status_bg status_happiness' style={{backgroundImage: `linear-gradient(to bottom, transparent ${100 - fillHappiness}%, #FCD754 0% ${fillHappiness}%)`}}></div>
                <HappinessStatus />
            </div>
        </div>
    )
}

export default StatusIndicator
