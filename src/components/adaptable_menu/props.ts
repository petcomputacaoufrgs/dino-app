import MenuItem from '../../types/MenuItem'

/**
 * @description Propriedades do menu drawer.
 */
export default class AdaptableMenuProps{
    /**
     * @description Item que serão exibidos no menu
     */
    items: MenuItem[]

    /**
     * @param items Define os itens que serão exibidos no menu
     */
    constructor(items: MenuItem[]) {
        this.items = items
    }   
}