import { isMobile } from "react-device-detect"

class ViewportService {
    autoResizeViewport() {
        if (isMobile) {
            this.resizeViewportToMax()
            window.onorientationchange = this.resizeViewportToMax
        }
    }

    private resizeViewportToMax() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
            let viewport = document.querySelector("meta[name=viewport]");
            if (viewport) {
                viewport.setAttribute("content", "height=" + vh + ", width=" + vw + ", initial-scale=1.0");
            }
        }
    }

}

export default new ViewportService()