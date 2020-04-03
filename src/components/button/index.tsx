import React from 'react'
import MaterialButton from '@material-ui/core/Button'
import ButtonProps from './props'
import './styles.css'

/**
 * @description Botão básico
 * @param props propriedades possíveis para este botão
 */
const Button = (props: ButtonProps) => {

    /**
     * @description Retorna o nome da classe baseado nas props do botão
     */
    const getClassName = (): string => {
        let className = 'button'

        if (props.className) {
            className = className.concat(' ').concat(props.className)
        }

        return className
    }

    /**
     * @description Retorna um Elemento JSX com a imagem do botão
     */
    const getImageComponent = (): JSX.Element => {
        if (props.imageSrc) {
            if (props.imageAlt) {
                return (
                    <img className='button__start_icon' src={props.imageSrc} alt={props.imageAlt} />
                )
            } else {
                throw Error('Image without alt property!')
            }   
        }
        
        return (<></>)
    }

    return (
        <div className={getClassName()} onClick={props.onClick}>
            <MaterialButton 
                startIcon={getImageComponent()} 
                className='button__material_button' 
                variant='contained' 
                disabled={props.disabled}
                size={props.size}
            >
                    {props.children}
            </MaterialButton>
        </div>
    )
}

export default Button