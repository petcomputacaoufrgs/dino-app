import { ReportHandler } from 'web-vitals'

class ReportWebVitalsService {
	async start(onPerfEntry?: ReportHandler) {
		if (onPerfEntry && onPerfEntry instanceof Function) {
			const webVitals = await import('web-vitals')
			webVitals.getCLS(onPerfEntry)
			webVitals.getFID(onPerfEntry)
			webVitals.getFCP(onPerfEntry)
			webVitals.getLCP(onPerfEntry)
			webVitals.getTTFB(onPerfEntry)
		}
	}
}

export default new ReportWebVitalsService()
