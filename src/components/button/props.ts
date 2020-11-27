import { MouseEventHandler } from 'react'

export default interface ButtonProps {
  onClick: MouseEventHandler<any>
  ariaLabel?: string
  inputRef?: React.RefObject<HTMLInputElement>
  className?: string
  disabled?: boolean | undefined
  text?: string
}
