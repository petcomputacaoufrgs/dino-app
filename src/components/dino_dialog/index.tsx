import React from 'react'
import './styles.css'
import { DinoDialogHeaderProps, DinoDialogContentProps } from './props'
import { ReactComponent as DinoAuthSVG } from '../../assets/icons/dino_auth.svg'

export const DinoDialogHeader = ({title}: DinoDialogHeaderProps) => {
  return (
    <div className="dino_dialog__header">
      <div className="dino_dialog__header__title">
        <h1>{title}</h1>
      </div>
      <DinoAuthSVG />
  </div>
  )
}

export const DinoDialogContent = ({text}: DinoDialogContentProps) => {
  return (
    <div className="dino_dialog__content">
        <p>{text}</p>
    </div>
  )
}

export default DinoDialogHeader
