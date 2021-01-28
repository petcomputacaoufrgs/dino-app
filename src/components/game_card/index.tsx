import React, { useRef } from 'react'
import GameCardProps from './props'
import './styles.css'

const GameCard: React.FC<GameCardProps> = ({
	onClick,
	ariaLabel,
	background,
	text
}) => {
	const buttonRef = useRef<HTMLButtonElement>(null)

	return (
		<button
			className={'game_card'}
			onClick={onClick}
			ref={buttonRef}
			aria-label={ariaLabel}
			style = {{backgroundImage: `url(${background})`}}
		>
			{text}
		</button>
	)
}

export default GameCard
