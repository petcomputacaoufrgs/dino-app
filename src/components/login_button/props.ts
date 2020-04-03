/**
 * @description Propriedades do botão de login
 */
export default interface LoginButtonProps {
    buttonText: string
    onFail?: () => void
    onCancel?: () => void
    size?: 'small' | 'medium' | 'large'
}