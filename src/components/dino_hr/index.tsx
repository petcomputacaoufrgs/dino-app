import React from 'react'
import './styles.css'

interface DinoHrProps {
  invisible?: boolean
}

const DinoHr = ({ invisible }: DinoHrProps) => {
  return (
    <hr className={`dino_hr${invisible ? '--inv' : ''}`} />
  )
}

export default DinoHr