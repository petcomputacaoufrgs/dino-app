import { Tooltip } from '@material-ui/core'
import React from 'react'
import Button from '..'
import DinoIconButtonProps from './props'
import './style.css'

const DinoIconButton: React.FC<DinoIconButtonProps> = props => {
	const Icon = props.icon

	const getClassName = (): string => {
		let mainClass = 'dino_icon_button__button'

		if (props.className) {
			mainClass = mainClass.concat(' ').concat(props.className)
		}

		if (props.bigger) {
			mainClass = mainClass.concat(' button_bigger')
		}

		if (props.lum) {
			mainClass = mainClass.concat(` button_${props.lum}`)
		}

		return mainClass
	}

	return (
		<div className="dino_icon_button">
			<Tooltip placement="top" title={props.ariaLabel || ''} arrow className="dino_icon_button__tooltip">
				<div>
					<Button {...props} className={getClassName()}>
						<Icon />
					</Button>
				</div>
			</Tooltip>
		</div>
	)
}

export default DinoIconButton
