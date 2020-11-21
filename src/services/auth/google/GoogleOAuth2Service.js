import GoogleSecrets from '../../../environment/client_secret.json'

/* eslint-disable no-undef */

class GoogleOAuth2Service {
  initClient = async (callback) => {
    gapi.load('auth2', () => {
      try {
        const auth2 = gapi.auth2.init({
          client_id: GoogleSecrets.client_id,
        })

        callback(auth2)
      } catch (e) {
        console.log(e)
        callback(undefined)
      }
    })
  }

  requestLogin = async (googleAuth2) => {
    console.log(googleAuth2)
    const response = await googleAuth2.client.grantOfflineAccess()
    
    return response.code
  }

  requestGrant = async (scopeList) => {
    const authInstance = gapi.auth2.getAuthInstance()

    if (authInstance && authInstance.currentUser) {
      const currentUser = authInstance.currentUser.get()
      const scopeString = scopeList.join(' ')

      const response = await currentUser.grant({
        scope: scopeString,
        prompt: "consent",
        approval_prompt: 'force'
      })

      console.log(response)
    }
  } 

}

export default new GoogleOAuth2Service()
