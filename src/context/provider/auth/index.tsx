import React, { useState, useEffect, createContext, useContext } from 'react'
import AuthService from '../../../services/auth/AuthService'
import AuthContextUpdater from '../../updater/AuthContextUpdater'

interface AuthContextType {
    isAuthenticated: boolean
    loading: boolean
}

const AuthContext = createContext({
    isAuthenticated: false,
    loading: true
} as AuthContextType)

const AuthProvider: React.FC = ({
    children
}) => {
  const [value, setValue] = useState<AuthContextType>({
    isAuthenticated: false,
    loading: true
  })

  const [first, setFirst] = useState(true)

  useEffect(() => {
    const updateValue = async () => {
        const isAuthenticated = await AuthService.isAuthenticated()
        setValue({
            isAuthenticated: isAuthenticated,
            loading: false
        })
    }

    let handleLocalDataChanged = () => {
        updateValue()
    }

    AuthContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      handleLocalDataChanged = () => {}
    }

    if (first) {
      setFirst(false)
      updateValue()
    }

    return cleanBeforeUpdate
  }, [value, first])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
