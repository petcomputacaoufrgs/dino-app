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
                <div className='status_bg status_health' style={{ clipPath: `circle(50% at 50% ${fillHealth - 50}%`, height: `${fillHealth}` }}></div>
                <HealthStatus />

            </div>
            <div className='status_item'>
                <div className='status_bg status_energy' style={{ clipPath: `circle(50% at 50% ${fillEnergy - 50}%`, height: `${fillEnergy}` }}></div>
                <EnergyStatus />
            </div>
            <div className='status_item'>
                <div className='status_bg status_happiness' style={{ clipPath: `circle(50% at 50% ${fillHappiness - 50}%`, height: `${fillHappiness}` }}></div>
                <HappinessStatus />
            </div>
        </div>
    )
}

export default StatusIndicator
