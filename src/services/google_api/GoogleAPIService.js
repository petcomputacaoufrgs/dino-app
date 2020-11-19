import GoogleSecrets from '../../environment/client_secret.json'

/* eslint-disable no-undef */

class GoogleAPIService {
  requestLogin = async (callback) => {
    gapi.load('auth2', async () => {
      try {
        const auth2 = gapi.auth2.init({
          client_id: GoogleSecrets.web.client_id,
        })
        const response = await auth2.grantOfflineAccess()

        callback(response.code)
      } catch {
        callback(null)
      }
    })
  }
}

export default new GoogleAPIService()
