import React from 'react'
import './styles.css'

interface DinoHrProps {
	invisible?: boolean
}

const DinoHr = ({ invisible }: DinoHrProps) => {
	return <hr className={`dino_hr${invisible ? '__inv' : ''}`} />
}

export default DinoHr
