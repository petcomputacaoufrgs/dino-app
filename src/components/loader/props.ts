/**
 * @description Propriedades do loader
 */
export default class LoaderProps{
    loading: boolean

    /**
     * 
     * @param loading Define se o loader está ativo ou não
     */
    constructor(loading: boolean) {
        this.loading = loading
    }
}