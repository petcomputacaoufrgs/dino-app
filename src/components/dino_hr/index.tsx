import React from 'react'
import './styles.css'

interface DinoHrProps {
	invisible?: boolean
	className?: string
}

const DinoHr: React.FC<DinoHrProps> = ({ invisible, className }) => {
	return (
		<hr
			className={`dino_hr${invisible ? '__inv' : ''} ${
				className ? className : ''
			}`}
		/>
	)
}

export default DinoHr
