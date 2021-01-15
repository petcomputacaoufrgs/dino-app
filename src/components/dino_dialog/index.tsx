import React from 'react'
import DinoDialogProps from './props'
import { ReactComponent as DinoAuthSVG } from '../../assets/icons/dino_auth.svg'
import './styles.css'

export const DinoDialogHeader = ({ children }: DinoDialogProps) => {
  return (
    <div className="dino_dialog__header">
      <div className="dino_dialog__header__title">{children}</div>
      <DinoAuthSVG />
    </div>
  )
}

export const DinoDialogContent = ({ children }: DinoDialogProps) => {
  return <div className="dino_dialog__content">{children}</div>
}

export default DinoDialogHeader
