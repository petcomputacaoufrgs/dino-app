/* eslint-disable no-undef */

class GoogleOAuth2Service {
	init = async callback => {
		gapi.load('auth2', () => {
			try {
				callback(true)
			} catch (e) {
				callback(false)
			}
		})
	}

	requestLogin = async (forceConsent, email) => {
		const options = {
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			scope: 'email profile openid',
			response_type: 'code',
			include_granted_scopes: true,
		}

		if (email) {
			options.login_hint = email
		}

		if (forceConsent) {
			options.prompt = 'consent'
		}

		return new Promise((resolve, reject) => {
			gapi.auth2.authorize(options, response => {
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
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			scope: scopeString,
			response_type: 'code',
			login_hint: email,
			include_granted_scopes: true,
		}

		if (refreshTokenNecessary) {
			options.prompt = 'consent'
		}

		return new Promise((resolve, reject) => {
			gapi.auth2.authorize(options, response => {
				if (response.error) {
					reject(response.error)
				} else {
					resolve(response.code)
				}
			})
		})
	}

	// getEvents(googleCalendarId) {
	// 	if (googleCalendarId) {
	// 		console.log('nop')
	// 	} else {
	// 		const request = gapi.client.calendar.calendarList.list()

	// 		request.execute(resp => {
	// 			const calendars = resp.items
	// 			console.log(calendars)
	// 		})
	// 	}
	// }
}

export default new GoogleOAuth2Service()
