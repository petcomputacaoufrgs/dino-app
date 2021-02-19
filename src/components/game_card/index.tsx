import React, { useRef } from 'react'
import GameCardProps from './props'
import './styles.css'

const GameCard: React.FC<GameCardProps> = ({
	onClick,
	ariaLabel,
	backgroundColor,
	text,
}) => {
	const buttonRef = useRef<HTMLButtonElement>(null)

	return (
		<button
			className={'game_card'}
			onClick={onClick}
			aria-label={ariaLabel}
			style={{ backgroundColor: backgroundColor }}
		>
			{text}
		</button>
	)
}

export default GameCard
