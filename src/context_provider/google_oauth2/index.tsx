import React, { useState, useEffect, createContext, useContext } from 'react'
import GoogleAuth2ContextType from '../../types/context_provider/GoogleAuth2ContextType'
import GoogleOAuth2Service from '../../services/auth/google/GoogleOAuth2Service'
import GoogleContactGrantContextUpdater from '../../context_updater/GoogleContactGrantContextUpdater'
import AuthService from '../../services/auth/AuthService'

const GoogleAuth2Context = createContext({
  loaded: false
} as GoogleAuth2ContextType)

const GoogleOAuth2ContextProvider: React.FC = (props) => {
  const [context, setContext] = useState<GoogleAuth2ContextType>({
    loaded: false,
    hasContactGrant: false
  })

  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    let handleInitUpdate = (loaded: boolean) => {
      setContext({
        loaded: loaded,
        hasContactGrant: context.hasContactGrant
      })
    }

    let handleContactGrantUpdate = () => {
      setContext({
        loaded: context.loaded,
        hasContactGrant: AuthService.hasGoogleContactsGrant()
      })
    }

    const init = () => {
      GoogleOAuth2Service.init(handleInitUpdate)
    }

    GoogleContactGrantContextUpdater.setCallback(handleContactGrantUpdate)

    if (firstLoad) {
      init()
      setFirstLoad(false)
    }

    const cleanBeforeUpdate = () => {
      handleInitUpdate = () => {}
      handleContactGrantUpdate = () => {}
    }

    return cleanBeforeUpdate
  }, [context, firstLoad])

  return (
    <GoogleAuth2Context.Provider value={context}>
      {props.children}
    </GoogleAuth2Context.Provider>
  )
}

export const useGoogleOAuth2 = () => useContext(GoogleAuth2Context)

export default GoogleOAuth2ContextProvider
