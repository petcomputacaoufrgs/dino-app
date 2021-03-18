import { MouseEventHandler } from 'react'

export default interface ButtonProps {
	onClick?: MouseEventHandler<any>
	ariaLabel?: string
	inputRef?: React.RefObject<HTMLInputElement>
	className?: string
	disabled?: boolean
	outline?: boolean
	type?: "button" | "submit" | "reset"
}
