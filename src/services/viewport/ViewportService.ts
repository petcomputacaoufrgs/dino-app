import OrientationUtils from '../../utils/OrientationUtils'
import OrientationEnum from '../../types/system/OrientationEnum'

class ViewportService {
  maximizeViewport = () => {
    window.removeEventListener('orientationchange', this.maximizeViewport)
    const currentOrientation = OrientationUtils.getCurrentOrientation()
    if (currentOrientation === OrientationEnum.PORTRAIT) {
      this.maximize()
    } else {
      window.addEventListener('orientationchange', this.maximizeViewport)
    }
  }

  private maximize = () => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    )
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    )
    const viewport = document.querySelector('meta[name=viewport]')
    if (viewport) {
      viewport.setAttribute(
        'content',
        'height=' + vh + ', width=' + vw + ', initial-scale=1.0'
      )
    }
  }
}

export default new ViewportService()
