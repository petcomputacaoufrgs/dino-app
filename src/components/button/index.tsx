import React from 'react'
import MaterialButton from '@material-ui/core/Button'
import Props from './props'
import './styles.css'

const Button = (props: Props) => {
    return (
        <div className='button' onClick={props.onClick}>
            <MaterialButton className='button__material_button' variant='contained' color='inherit' disabled={props.disabled}>{props.children}</MaterialButton>
        </div>
    )
}

export default Button