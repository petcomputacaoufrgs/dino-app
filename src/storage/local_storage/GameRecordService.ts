import BaseLocalStorage from './BaseLocalStorage'

class GameRecordService extends BaseLocalStorage {
	getRecord = (gameEnum: string): number => {
		const value = this.get(gameEnum)

		return value ? JSON.parse(value) : 0
	}

	setRecord = (gameEnum: string, value: number) => {
		this.set(gameEnum, JSON.stringify(value))
	}
}

export default new GameRecordService()
