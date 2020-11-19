import GoogleSecrets from '../../../environment/client_secret.json'

/* eslint-disable no-undef */

class GoogleOAuth2Service {
  initClient = async (callback) => {
    gapi.load('auth2', () => {
      try {
        const auth2 = gapi.auth2.init({
          client_id: GoogleSecrets.web.client_id,
        })

        callback(auth2)
      } catch {
        callback(undefined)
      }
    })
  }

  requestLogin = async (googleAuth2) => {
    const response = await googleAuth2.client.grantOfflineAccess()

    return response.code
  }
}

export default new GoogleOAuth2Service()
