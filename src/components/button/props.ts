import MouseEvent from '../../types/MouseEvent'

/**
 * @description Propriedades do botão
 */
export default interface ButtonProps {
    onClick: MouseEvent
    disabled?: boolean | undefined
    children?: any
}