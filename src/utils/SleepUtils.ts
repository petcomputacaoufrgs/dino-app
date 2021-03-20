class SleepUtils {
	/** @description Simulates setTimeout using Promise */
	sleep = (ms: number): Promise<void> => {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}

export default new SleepUtils()
