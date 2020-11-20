import React, {useEffect, useRef} from 'react'
import MaterialButton from '@material-ui/core/Button'
import ButtonProps from './props'
import './styles.css'

const Button = (props: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
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
  
  useEffect(() => {
    if(props.inputRef && props.inputRef.current){
      props.inputRef.current.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
          event.preventDefault()
          if(buttonRef.current){
            buttonRef.current.click()
            buttonRef.current.focus()
          }
        }})
    }
  })

  return (
    <div className={getClassName()}>
      <MaterialButton
        startIcon={getImageComponent()}
        className="button__material_button"
        variant="contained"
        disabled={props.disabled}
        size={props.size}
        onClick={props.onClick}
        ref = {buttonRef}
      >
        {props.children}
      </MaterialButton>
    </div>
  )
}

export default Button
