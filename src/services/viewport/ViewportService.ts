import { isMobile, isTablet } from "react-device-detect"

class ViewportService {
    autoResizeViewport() {
        if (isMobile) {
            this.resizeViewportToMaxMobile()
            window.onorientationchange = this.resizeViewportToMaxMobile
        } else if (isTablet) {
            this.resizeViewportToMaxTablet()
            window.onorientationchange = this.resizeViewportToMaxTablet
        }
    }

    private resizeViewportToMaxMobile = () => {
        if (window.matchMedia("(orientation: portrait)").matches) {
            this.resizeViewportToMax()
        }
    }

    private resizeViewportToMaxTablet = () => {
        if (window.matchMedia("(orientation: landscape)").matches) {
            this.resizeViewportToMax()
        }
    }

    private resizeViewportToMax() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        let viewport = document.querySelector("meta[name=viewport]");
        if (viewport) {
            viewport.setAttribute("content", "height=" + vh + ", width=" + vw + ", initial-scale=1.0");
        }
    }

}

export default new ViewportService()