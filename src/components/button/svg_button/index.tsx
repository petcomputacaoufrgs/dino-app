import React from 'react'
import SVGButtonProps from './props'
import './styles.css'
import { Fab, Button } from '@material-ui/core'

const SVGButton: React.FC<SVGButtonProps> = ({ onClick, ariaLabel, SVG, fab }) => {
    return (
      <>
        {fab ? 
          <Fab onClick={onClick} className="svg_button" aria-label={ariaLabel}>
            <SVG />
          </Fab>
          : 
          <Button onClick={onClick} className="svg_button" aria-label={ariaLabel}>
            <SVG />
          </Button>
        }
        
      </>
    )
}

export default SVGButton