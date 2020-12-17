import GoogleSecrets from '../../../environment/google_config.json'

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

  requestLogin = async (forceConsent) => {
    const options = {
      client_id: GoogleSecrets.client_id,
      scope: 'email profile openid',
      response_type: 'code',
      include_granted_scopes: true,
    }

    if (forceConsent) {
      options.prompt = 'consent'
    }

    return new Promise((resolve, reject) => {
      gapi.auth2.authorize(options, (response) => {
        if (response.error) {
          reject(undefined)
        } else {
          resolve(response.code)
        }
      })
    })
  }

  requestGrant = async (scopeList, email, refreshTokenNecessary) => {
    const scopeString = scopeList.join(' ')

    const options = {
      client_id: GoogleSecrets.client_id,
      scope: scopeString,
      response_type: 'code',
      login_hint: email,
      include_granted_scopes: true,
    }

    if (refreshTokenNecessary) {
      options.prompt = 'consent'
    }

    return new Promise((resolve, reject) => {
      gapi.auth2.authorize(options, (response) => {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response.code)
        }
      })
    })
  }
}

export default new GoogleOAuth2Service()
