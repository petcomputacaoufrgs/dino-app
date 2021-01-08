import React, { useState, useEffect, createContext, useContext } from 'react'
import GoogleOAuth2Service from '../../services/auth/google/GoogleOAuth2Service'

interface GoogleAuth2ContextType {
  loading: boolean
}

const GoogleOAuth2Context = createContext({
  loading: true,
} as GoogleAuth2ContextType)

const GoogleOAuth2Provider: React.FC = (props) => {
  const [value, setValue] = useState<GoogleAuth2ContextType>({
    loading: true,
  })

  useEffect(() => {
    let handleInitUpdate = (loaded: boolean) => {
      setValue({
        loading: false,
      })
    }

    const init = () => {
      GoogleOAuth2Service.init(handleInitUpdate)
    }

    const cleanBeforeUpdate = () => {
      handleInitUpdate = () => {}
    }

    init()

    return cleanBeforeUpdate
  }, [])

  return (
    <GoogleOAuth2Context.Provider value={value}>
      {props.children}
    </GoogleOAuth2Context.Provider>
  )
}

export const useGoogleOAuth2 = () => useContext(GoogleOAuth2Context)

export default GoogleOAuth2Provider
