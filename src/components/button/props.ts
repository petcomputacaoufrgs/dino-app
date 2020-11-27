import { MouseEventHandler } from 'react'

/**
 * @description Propriedades do botão
 */
export default interface ButtonProps {
  onClick: MouseEventHandler<any>
  className?: string
  imageSrc?: string
  imageAlt?: string
  disabled?: boolean | undefined
  children?: any
  size?: 'small' | 'medium' | 'large'
  id?: string
}
