import { Switch } from '@material-ui/core'
import React from 'react'
import SwitchProps from './props'
import './styles.css'

const DinoSwitch = ({selected, setSelected, label}: SwitchProps) => {

  return (
      <div className="dino_switch__form">
        <p>{label}</p>
        <Switch
          size="medium"
          className="dino_switch__form__switch"
          checked={selected}
          onClick={() => setSelected(!selected)}
        />
    </div>
  )
}

export default DinoSwitch