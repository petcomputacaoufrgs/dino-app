import GoogleSecrets from '../../../environment/client_secret.json'

/* eslint-disable no-undef */

class GoogleOAuth2Service {
  init = async (callback) => {
    gapi.load('auth2', () => {
      try {
        callback(true)
      } catch (e) {
        callback(false)
      }
    })
  }

  requestLogin = async () => {
    return new Promise((resolve, reject) => {
      gapi.auth2.authorize({
        client_id: GoogleSecrets.client_id,
        scope: 'email profile openid',
        response_type: 'code'
      }, response => {
          if (response.error) {
            reject(response.error)
          } else {
            resolve(response.code)
          }
      });
    });
  }

  requestGrant = async (googleAuth2, scopeList, email) => {
    const scopeString = scopeList.join(' ')

    return new Promise((resolve, reject) => {
      gapi.auth2.authorize({
        client_id: GoogleSecrets.client_id,
        scope: scopeString,
        response_type: 'code',
        login_hint: email,
        include_granted_scopes: true
      }, response => {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response.code)
        }
      });
    });
  }
}

export default new GoogleOAuth2Service()
