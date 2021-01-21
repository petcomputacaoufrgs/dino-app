import React from 'react'
import Button from '..'
import ButtonProps from '../props'
import './styles.css'

const TextButton: React.FC<ButtonProps> = props => {
	const getClassName = (): string => {
		let mainClass = 'text_button'

		if (props.className) {
			mainClass = mainClass.concat(' ').concat(props.className)
		}

		return mainClass
	}

	return (
		<Button {...props} className={getClassName()}>
			{props.children}
		</Button>
	)
}

export default TextButton
