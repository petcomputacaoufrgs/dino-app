/**
 * @description Propriedades do botão de login
 */
export default interface LoginButtonProps {
  buttonText: string
  onGoogleFail?: () => void
  onDinoAPIFail?: () => void
  onRefreshTokenLostError?: () => void
  onCancel?: () => void
  size?: 'small' | 'medium' | 'large'
}
