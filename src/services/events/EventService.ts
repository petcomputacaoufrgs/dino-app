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
import TabControlService from '../tab_control/TabControlService'
import ResponsibleAuthService from '../auth/ResponsibleAuthService'

class EventService {
	constructor() {
		ConnectionService.addEventListener(this.connectionCallback)
	}

	whenStart = () => {
		ResponsibleAuthService.responsibleLogout()
		ErrorHandlerService.register()
		if (process.env.NODE_ENV === 'development') {
			this.startWebSocketAndSync()
		}
	}

	whenTabLoad = async () => {
		const isMainTab = await TabControlService.isMainTab()

		if (isMainTab) {
			this.startWebSocketAndSync()
		} else {
			this.closeWebSocket()
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
		const isDinoConnected = await ConnectionService.isDinoConnected()
		const isAuthenticated = await AuthService.isAuthenticated()
		if (isDinoConnected && isAuthenticated) {
			const success = WebSocketService.connect()
			if (success) {
				SyncService.sync()
			}
		}
	}

	private closeWebSocket = async () => {
		WebSocketService.disconnect()
	}

	private connectionCallback = (online: boolean) => {
		online ? this.whenConnectionReturn() : this.whenConnectionLost()
	}
}

export default new EventService()
