import React, { createContext, useState } from 'react'
import AlertContextValue from './context'
import AlertProps from '../../components/alert/props'
import Alert from '../../components/alert'
import AlertProviderProps from './props'

const ALERT_DURATION = 4000 

export const AlertContext = createContext({
    'showSuccessAlert': (message: string) => {},
    'showWarningAlert': (message: string) => {},
    'showInfoAlert': (message: string) => {},
    'showErrorAlert': (message: string) => {}
} as AlertContextValue)

const AlertProvider = (props: AlertProviderProps) => {
    const [alertList, setAlertList] = useState(new Array<AlertProps>())

    const showAlert = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {    
        const newSuccessAlert = { 
            'message': message,
            'severity': severity
        } as AlertProps
        
        setAlertList([...alertList, newSuccessAlert])
        setTimeout(removeAlert, ALERT_DURATION)
    }

    const removeAlert = () => {
        const newAlertList = [...alertList]

        newAlertList.shift()

        setAlertList(newAlertList)
    }

    const value: AlertContextValue = {
        'showSuccessAlert': (message: string) => showAlert(message, 'success'),
        'showWarningAlert': (message: string) => showAlert(message, 'warning'),
        'showInfoAlert': (message: string) => showAlert(message, 'info'),
        'showErrorAlert': (message: string) => showAlert(message, 'error')
    }

    const renderAlerts = (): JSX.Element => (
        <>
        {alertList.map((alertProps, index) => (
            <Alert {...alertProps} key={index} />
        ))}
        </>
    )

    return (
        <AlertContext.Provider value={ value }>
            {props.children}
            {renderAlerts()}
        </AlertContext.Provider>
    )
}

export default AlertProvider