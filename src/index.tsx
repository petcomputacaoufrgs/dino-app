import ReactDOM from 'react-dom'
import * as ServiceWorkerRegistration from './ServiceWorkerRegistration'
import AlertProvider from './context/alert'
import EventService from './services/events/EventService'
import GoogleOAuth2Provider from './context/google_oauth2'
import LanguageProvider from './context/language'
import LogoutService from './services/auth/LogoutService'
import PostMessageService from './services/service_worker/PostMessageService'
import App from './App'
import reportWebVitals from './reportWebVitals'
import TabControlService from './services/tab_control/TabControlService'
import './external/MaterialIcons.css'
import './fonts.css'
import './var.css'

window.addEventListener('load', async () => {
	EventService.whenStart()
	LogoutService.start()
	ServiceWorkerRegistration.register()
	await TabControlService.registerTab()
	await PostMessageService.register()
	TabControlService.registerUnloadEvent()
})

ReactDOM.render(
	<GoogleOAuth2Provider>
		<AlertProvider>
			<LanguageProvider>
				<App />
			</LanguageProvider>
		</AlertProvider>
	</GoogleOAuth2Provider>,
	document.getElementById('root'),
)

reportWebVitals()