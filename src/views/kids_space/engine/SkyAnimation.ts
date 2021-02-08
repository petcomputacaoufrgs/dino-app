import ArrayUtils from '../../../utils/ArrayUtils'
import { getRandomInteger } from '../../../utils/RandomUtils'
import sleep from '../../../utils/SleepUtils'

export default class SkyAnimation {
	duration = 0
	queueCount = 0
	isRunning = true
	hasClickEvent = true
	randomQueue: ((value: number | PromiseLike<number>) => void)[] = []

	public startSkyEngine(
		elements: HTMLElement[],
		speed?: number,
		cancelClickEvent?: boolean,
	) {
		this.isRunning = true
		this.queueCount = 0
		this.duration = speed !== undefined ? speed : this.getRandomDuration()

		if (cancelClickEvent) this.hasClickEvent = false

		ArrayUtils.suffle(elements)

		this.startAnimations(elements)
	}

	public stopSkyEngine = () => {
		this.isRunning = false
	}

	private async startAnimations(elements: HTMLElement[]) {
		for (const element of elements) {
			if (element) {
				if (this.hasClickEvent)
					element.onclick = () => this.handleCloudClick(element)
				this.runCloudAnimation(element)
				await sleep((this.duration / elements.length) * 2)
			}
		}
	}

	private async handleCloudClick(cloud: HTMLElement) {
		let opacity = 1
		while (opacity > 0) {
			opacity = opacity - 0.1
			cloud.style.opacity = `${opacity}`
			await sleep(100)
		}
	}

	private async runCloudAnimation(cloud: HTMLElement) {
		const id = cloud.id
		let sleepTime = 100
		cloud.style.animationDuration = `${this.duration}ms`
		while (this.isRunning) {
			cloud.removeAttribute('id')
			await sleep(sleepTime)
			cloud.style.opacity = '1'
			cloud.style.visibility = 'visible'
			cloud.setAttribute('id', id)
			await sleep(this.duration)
			cloud.style.visibility = 'hidden'
			sleepTime = await this.getRandomSleep()
		}
	}

	private getRandomDuration(): number {
		return getRandomInteger(30000, 70000)
	}

	private getRandomSleep(): Promise<number> {
		return new Promise<number>(resolve => {
			this.randomQueue.push(resolve)
			if (this.randomQueue.length === 1) this.resolveRandomSleepQueue()
		})
	}

	private async resolveRandomSleepQueue() {
		const resolve = this.randomQueue.shift()
		if (resolve) resolve(this.getSleepValue())

		await sleep(getRandomInteger(50, 150))
		if (this.randomQueue.length > 0) this.resolveRandomSleepQueue()
	}

	private getSleepValue(): number {
		if (this.queueCount === 0) {
			this.queueCount++
			return getRandomInteger(0, this.duration * 0.02)
		}
		if (this.queueCount === 1) {
			this.queueCount++
			return getRandomInteger(this.duration * 0.1, this.duration * 0.2)
		}
		if (this.queueCount === 2) {
			this.queueCount++
			return getRandomInteger(this.duration * 0.4, this.duration * 0.6)
		}

		this.queueCount = 0
		return getRandomInteger(this.duration * 0.8, this.duration * 1)
	}
}
