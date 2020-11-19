import React, { useState, useEffect, createContext, useContext } from 'react'
import GoogleAuth2ContextType from '../../types/context_provider/GoogleAuth2ContextType'
import GoogleOAuth2Service from '../../services/auth/google/GoogleOAuth2Service'

const GoogleAuth2Context = createContext({
  client: undefined,
} as GoogleAuth2ContextType)

const GoogleAuth2ContextProvider: React.FC = (props) => {
  const [context, setContext] = useState<GoogleAuth2ContextType>({
    client: undefined,
  })

  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    let handleUpdate = (auth2: any) => {
      setContext({
        client: auth2
      })
    }

    const init = () => {
      GoogleOAuth2Service.initClient(handleUpdate)
    }

    if (firstLoad) {
      init()
      setFirstLoad(false)
    }

    const cleanBeforeUpdate = () => {
      handleUpdate = () => {}
    }

    return cleanBeforeUpdate
  }, [context, firstLoad])

  return (
    <GoogleAuth2Context.Provider value={context}>
      {props.children}
    </GoogleAuth2Context.Provider>
  )
}

export const useGoogleAuth2 = () => useContext(GoogleAuth2Context)

export default GoogleAuth2ContextProvider
