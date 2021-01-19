import React from 'react'
import './styles.css'

interface LinkButtonProps {
	text: string
	onClick: () => void
}

const LinkButton = ({ text, onClick }: LinkButtonProps): JSX.Element => (
	<button className='link_button' onClick={onClick}>
		{text}
	</button>
)

export default LinkButton
