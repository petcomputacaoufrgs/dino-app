/**
 * @description Propriedades do botão de login
 */
export default interface LoginButtonProps {
  text: string
  onGoogleFail?: () => void
  onDinoAPIFail?: () => void
  onRefreshTokenLostError?: () => void
  onCancel?: () => void
  size?: 'small' | 'medium' | 'large'
}
