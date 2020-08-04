import React, { useState, useEffect, createContext, useContext } from 'react'
import AlertProps from '../../components/alert/props'
import Alert from '../../components/alert'
import AlertContextType from '../../types/context_provider/AlertContextType'

const ALERT_DURATION = 4000

const VERIFY_DELAY = 50

const AlertList = [] as AlertProps[]

const AddAlert = (
  message: string,
  severity: 'success' | 'info' | 'warning' | 'error'
) => {
  const newSuccessAlert = {
    message: message,
    severity: severity,
  } as AlertProps

  AlertList.push(newSuccessAlert)
}

const AlertContext = createContext({} as AlertContextType)

export const AlertControl: AlertContextType = {
  showSuccessAlert: (message: string) => AddAlert(message, 'success'),
  showWarningAlert: (message: string) => AddAlert(message, 'warning'),
  showInfoAlert: (message: string) => AddAlert(message, 'info'),
  showErrorAlert: (message: string) => AddAlert(message, 'error'),
}

const AlertContextProvider: React.FC = (props) => {
  const [alert, setAlert] = useState(undefined as AlertProps | undefined)

  useEffect(() => {
    const getNextAlert = () => {
      const newAlert = AlertList.shift()
      if (newAlert) {
        const now = new Date().getTime()
        newAlert.end = now + ALERT_DURATION
        newAlert.onClose = getNextAlert
      }

      setAlert(newAlert)
    }

    const verify = () => {
      if (alert && alert.end) {
        const now = new Date().getTime()

        if (alert.end <= now) {
          getNextAlert()
        }
      } else if (AlertList.length > 0) {
        getNextAlert()
      }
    }

    const interval = setInterval(verify, VERIFY_DELAY)

    if (alert) {
      const newAlert = alert
      newAlert.onClose = getNextAlert

      setAlert(newAlert)
    }

    return () => clearInterval(interval)
  }, [alert])

  return (
    <AlertContext.Provider value={AlertControl}>
      {alert && <Alert {...alert} />}
      {props.children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)

export default AlertContextProvider
