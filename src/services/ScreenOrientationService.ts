import ScreenOrientationConstants from "../constants/ScreenOrientationConstants"

/**
 * @description Service que fornece informações e ações baseadas no estado de rotação da tela. ESTA SERVICE NÃO É SUPORTADA POR TODOS OS NAVEGADORES, VERIFIQUE NA FUNÇÃO ANTES DE UTILIZÁ-LA.
 */
class ScreenOrientarionService {

    /**
     * @description Cria um evento que dispara (função callback) toda a vez que a orientação da tela for trocada. NÃO É SUPORTADO POR TODOS OS NAVEGADORES.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/orientationchange_event
     */
    setOnScreenOrientationChangeEvent = (callback: () => void) => {
        window.addEventListener('orientationchange', () => {
            callback()
        })
    }

    /**
     * @description Retorna true se a tela estiver no modo horizontal ou se a orientação de tela não for suportada pelo navegador utilizado. NÃO É SUPORTADO POR TODOS OS NAVEGADORES.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
     */
    isLandscape = () => {
        const currentOrientation = window.screen.orientation.type

        if (currentOrientation === ScreenOrientationConstants.LANDSCAPE ||
            currentOrientation === ScreenOrientationConstants.LANDSCAPE_UPSIDE_DOWN ||
            currentOrientation === ScreenOrientationConstants.NOT_SUPPORTED) {
            return true
        } else {
            return false
        }
    }

    /**
     * @description Retorna true se a tela estiver no modo vertical. NÃO É SUPORTADO POR TODOS OS NAVEGADORES.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
     */
    isPortrait = () => {
        const currentOrientation = window.screen.orientation.type

        if (currentOrientation === ScreenOrientationConstants.PORTRAIT ||
            currentOrientation === ScreenOrientationConstants.PORTRAIT_UPSIDE_DOWN) {
            return true
        } else {
            return false
        }
    }

}

export default new ScreenOrientarionService()