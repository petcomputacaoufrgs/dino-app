import React from 'react'
import MaterialButton from '@material-ui/core/Button'
import ButtonProps from './props'
import './styles.css'

const Button = (props: ButtonProps) => {
  const getClassName = (): string => {
    let className = 'button'

    if (props.className) {
      className = className.concat(' ').concat(props.className)
    }

    return className
  }

  const getImageComponent = (): JSX.Element => {
    if (props.imageSrc) {
      if (props.imageAlt) {
        return (
          <img
            className="button__start_icon"
            src={props.imageSrc}
            alt={props.imageAlt}
          />
        )
      } else {
        throw Error('Image without alt property!')
      }
    }

    return <></>
  }

  return (
    <div className={getClassName()}>
      <MaterialButton
        startIcon={getImageComponent()}
        className="button__material_button"
        variant="contained"
        disabled={props.disabled}
        size={props.size}
        id={props.id ? props.id : undefined}
        onClick={props.onClick}
      >
        {props.children}
      </MaterialButton>
    </div>
  )
}

export default Button
