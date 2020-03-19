import MenuItem from '../../types/MenuItem'

/**
 * @description Propriedades do menu drawer.
 */
export default class DrawerNavigationProps {
    /**
     * @description Item que serão exibidos no menu
     */
    items: MenuItem[]

    /**
     * @description Indice do item selecionado para aparecer quando o menu carregar, default é ZERO
     */
    selectedItem?: number

    /**
     * @description Defini se o estado do menu quando fechado deve exibir um mini menu ou não
     */
    mini?: boolean

    /**
     * @description Função disparada com a mudança de item no menu
     * @param index Indíce do novo item selecionado
     */
    onChange: (index: number) => void 

    /**
     * @param items Define os itens que serão exibidos no menu
     */
    constructor(items: MenuItem[], onChange: (index: number) => void, mini: boolean = false, selectedItem: number) {
        this.items = items
        this.onChange = onChange
        this.mini = mini
        this.selectedItem = selectedItem   
    }   
}