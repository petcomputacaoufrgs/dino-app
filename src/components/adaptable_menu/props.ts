import MenuItem from '../../types/MenuItem'

/**
 * @description Propriedades do menu drawer.
 */
export default interface AdaptableMenuProps{
    /**
     * @description Componente com os itens do menu
     */
    component: JSX.Element

    /**
     * @description Itens que serão exibidos no menu
     */
    items: MenuItem[]

    /**
     * @description Indice do item selecionado na lista de itens
     */
    selectedItem: number 

    /**
     * @description Componente que será colocado na barra superior
     */
    topBarComponent?: JSX.Element
}