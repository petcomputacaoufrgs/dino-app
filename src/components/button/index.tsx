import React from 'react'
import MaterialButton from '@material-ui/core/Button'
import ButtonProps from './props'
import './styles.css'

/**
 * @description Botão básico
 * @param props propriedades possíveis para este botão
 */
const Button = (props: ButtonProps) => (
    <div className='button' onClick={props.onClick}>
        <MaterialButton className='button__material_button' variant='contained' color='inherit' disabled={props.disabled}>{props.children}</MaterialButton>
    </div>
)

export default Button