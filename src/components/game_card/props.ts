import { MouseEventHandler } from 'react'

export default interface GameCardProps {
	onClick: MouseEventHandler<any>
	ariaLabel?: string
	backgroundColor: string
	text: string
}
