import MenuItem from '../../types/MenuItem'

/**
 * @description Propriedades do menu de navegação inferior
 */
export default class BottomNavigationProps{
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