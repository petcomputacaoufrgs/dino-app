export default interface AlertProviderValue {
  showSuccessAlert: (message: string) => void
  showWarningAlert: (message: string) => void
  showErrorAlert: (message: string) => void
  showInfoAlert: (message: string) => void
}
