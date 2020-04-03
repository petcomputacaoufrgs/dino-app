import MouseEvent from '../../types/MouseEvent'

/**
 * @description Propriedades do botão
 */
export default interface ButtonProps {
    onClick: MouseEvent
    className?: string
    imageSrc?: string
    imageAlt?: string
    disabled?: boolean | undefined
    children?: any
    size?: 'small' | 'medium' | 'large'
}