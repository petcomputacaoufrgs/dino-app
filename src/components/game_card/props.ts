import { MouseEventHandler } from 'react'

export default interface GameCardProps {
	onClick: MouseEventHandler<any>
	ariaLabel?: string
	background: string
	text: string
}
