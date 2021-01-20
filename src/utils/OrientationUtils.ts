import OrientationEnum from '../types/system/OrientationEnum'

class OrientationUtils {
	getCurrentOrientation = (): OrientationEnum => {
		if (window.matchMedia('(orientation: portrait)').matches) {
			return OrientationEnum.PORTRAIT
		} else {
			return OrientationEnum.LANDSCAPE
		}
	}
}

export default new OrientationUtils()
