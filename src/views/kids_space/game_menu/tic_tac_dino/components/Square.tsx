import React from 'react'

interface SquareProps {
	value: number
	onClick: () => void
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
	const style = value ? `squares ${value}` : 'squares'
	return <button className={style} onClick={onClick}></button>
}
export default Square
