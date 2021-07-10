import React from 'react'
import Button from '..'
import DinoIconButton from '../icon_button'
import CircularButtonProps from './props'
import './styles.css'

const CircularButton: React.FC<CircularButtonProps> = props => {
	const Icon = props.icon

	const getClassName = (): string => {
		let mainClass = 'circular_button'

		if (props.className) {
			mainClass = mainClass.concat(' ').concat(props.className)
		}

		return mainClass
	}

	return <DinoIconButton className={getClassName()} icon={Icon} />
}

export default CircularButton
