export default interface AlertProps {
    message: string
    severity: 'success' | 'info' | 'warning' | 'error'
}