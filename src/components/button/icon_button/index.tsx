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

    return mainClass
  }

  return (
    <Button {...props} className={getClassName()}>
      <Icon className='svg_icon'/>
    </Button>
  )
}

export default IconButton