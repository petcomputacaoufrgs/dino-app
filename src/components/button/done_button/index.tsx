import React from 'react'
import DoneButtonProps from './props'
import './styles.css'
import {ReactComponent as DoneIcon} from '../../../assets/icons/done.svg'
import { Fab } from '@material-ui/core'

const DoneButton: React.FC<DoneButtonProps> = ({ onClick, ariaLabel }) => {
    return (
      <Fab onClick={onClick} className="done_button" aria-label={ariaLabel}>
        <DoneIcon />
      </Fab>
    )
}

export default DoneButton