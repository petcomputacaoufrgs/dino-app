import React, { useState } from 'react'
import AlertSubProviderValue from './value'
import AlertProps from '../../../components/alert/props'
import Alert from '../../../components/alert'

const ALERT_DURATION = 4000

const AlertSubProvider = (): [JSX.Element, AlertSubProviderValue] => {
  const [alertList, setAlertList] = useState(new Array<AlertProps>())

  const showAlert = (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error'
  ) => {
    const newSuccessAlert = {
      message: message,
      severity: severity,
    } as AlertProps

    if (alertList.length === 0) {
      setTimeout(removeAlert, ALERT_DURATION)
    }

    setAlertList([...alertList, newSuccessAlert])
  }

  const removeAlert = () => {
    const newAlertList = [...alertList]

    newAlertList.shift()

    if (newAlertList.length > 0) {
      setTimeout(removeAlert, ALERT_DURATION)
    }

    setAlertList(newAlertList)
  }

  const render = (): JSX.Element => (
    <>{alertList.length > 0 && <Alert {...alertList[0]} />}</>
  )

  const value: AlertSubProviderValue = {
    showSuccessAlert: (message: string) => showAlert(message, 'success'),
    showWarningAlert: (message: string) => showAlert(message, 'warning'),
    showInfoAlert: (message: string) => showAlert(message, 'info'),
    showErrorAlert: (message: string) => showAlert(message, 'error'),
  }

  return [render(), value]
}

export default AlertSubProvider
