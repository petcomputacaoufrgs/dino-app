class MenuContextUpdater { 
    protected callback?: (component: JSX.Element) => void

    setCallback = (callback: (component: JSX.Element) => void) => {
        this.callback = callback
    }

    update: (component: JSX.Element) => void = (component: JSX.Element) => {
        if (this.callback) {
            this.callback(component)
        }
    }
}

export default new MenuContextUpdater()
