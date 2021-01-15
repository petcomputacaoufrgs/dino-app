import UpdateListenner from "../../types/update/UpdateListenner"

/**
 * @description Base class with update event callback
 */
export default abstract class UpdatableService {
    private updateListenners: UpdateListenner[]

    constructor() {
        this.updateListenners = []
    }

    /**
     * @description Add event listenner for local data update.
     * @param listenner callback called when local data is updated.
     */
    addUpdateEventListenner(listenner: UpdateListenner) {
        this.updateListenners.push(listenner)
    }

    /**
     * @description Remove event listenner for local data update.
     * @param listenner callback called when local data is updated.
     */
    removeUpdateEventListenner(listenner: UpdateListenner) {
        const index = this.updateListenners.findIndex(item => Object.is(item, listenner))
        this.updateListenners.splice(index, 1)
    }

    /**
     * @description Call update event listenners
     */
    protected triggerUpdateEvent = () => {
        this.updateListenners.forEach(listenner => listenner())
    }
}