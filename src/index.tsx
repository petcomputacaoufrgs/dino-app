import ReactDOM from 'react-dom'
import App from './App'
import * as ServiceWorkerRegistration from './ServiceWorkerRegistration'
import AlertProvider from './context/alert'
import EventService from './services/events/EventService'
import GoogleOAuth2Provider from './context/google_oauth2'
import LanguageProvider from './context/language'
import LogoutService from './services/auth/LogoutService'
import PostMessageService from './services/service_worker/PostMessageService'
import TabControlService from './services/tab_control/TabControlService'
import ReportWebVitalsService from './services/web_vitals/ReportWebVitalsService'
import './external/MaterialIcons.css'
import './fonts.css'
import './var.css'

window.addEventListener('load', async () => {
	ReportWebVitalsService.start()
	ServiceWorkerRegistration.start()
	PostMessageService.start()
	TabControlService.start()
	LogoutService.start()
	EventService.whenStart()
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