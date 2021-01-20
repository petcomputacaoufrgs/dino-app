import React from 'react'
import IconButtonProps from './props'
import TextButton from '../text_button'
import './style.css'

const TextIconButton: React.FC<IconButtonProps> = props => {
	const Icon = props.icon

	const getClassName = (): string => {
		let mainClass = 'text_icon_button'

		if (props.className) {
			mainClass = mainClass.concat(' ').concat(props.className)
		}

		return mainClass
	}

	return (
		<TextButton {...props} className={getClassName()}>
			<Icon className='svg_icon' />
			{props.children}
		</TextButton>
	)
}

export default TextIconButton
