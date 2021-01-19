import ConnectionService from '../connection/ConnectionService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import AuthService from '../auth/AuthService'
import SyncService from '../sync/SyncService'
import CalendarService from '../calendar/CalendarService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import WebSocketService from '../websocket/WebSocketService'
import ErrorHandlerService from '../error_handler/ErrorHandlerService'

class EventService {
	constructor() {
		ConnectionService.addEventListener(this.connectionCallback)
	}

	whenStart = async () => {
		ErrorHandlerService.register()

		const isDinoConnected = await ConnectionService.isDinoConnected()
		const isAuthenticated = await AuthService.isAuthenticated()
		if (isDinoConnected && isAuthenticated) {
			this.startWebSocketAndSync()
		}
	}

	whenLogin = async () => {
		CalendarService.addMocks()
		this.startWebSocketAndSync()
		HistoryService.push(PathConstants.HOME)
	}

	whenLogout = async () => {
		WebSocketService.disconnect()
		HistoryService.push(PathConstants.LOGIN)
	}

	whenLoginForbidden = async () => {
		AuthService.logout()
	}

	whenConnectionReturn = async () => {
		const isDinoConnected = await ConnectionService.isDinoConnected()
		const isAuthenticated = await AuthService.isAuthenticated()
		if (isDinoConnected && isAuthenticated) {
			this.startWebSocketAndSync()
		}
	}

	whenConnectionLost = () => {
		SyncService.setNotSynced()
		WebSocketService.disconnect()
	}

	whenError = (error: LogAppErrorModel) => {
		LogAppErrorService.logModel(error)
	}

	private startWebSocketAndSync = async () => {
		const success = WebSocketService.connect()
		if (success) {
			SyncService.sync()
		}
	}

	private connectionCallback = (online: boolean) => {
		online ? this.whenConnectionReturn() : this.whenConnectionLost()
	}
}

export default new EventService()
