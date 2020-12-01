import React from 'react'
import Button from '..'
import IconButtonProps from './props'
import './style.css'

const IconButton: React.FC<IconButtonProps> = (props) => {
  const Icon = props.icon

  const getClassName = (): string => {
    let mainClass = 'icon_button'

    if (props.className) {
      mainClass = mainClass.concat(' ').concat(props.className)
    }
    
    if (props.dark) {
      mainClass = mainClass.concat(' button_dark')
    }

    if (props.bigger) {
      mainClass = mainClass.concat(' button_bigger')
    }

    return mainClass
  }

  return (
    <Button {...props} className={getClassName()}>
      <Icon />
    </Button>
  )
}

export default IconButton