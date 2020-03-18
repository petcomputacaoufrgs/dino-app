import MenuItem from '../../types/MenuItem'

/**
 * @description Propriedades necessárias para carregar o ContentView
 */
export default class ContentViewProps {
    /**
     * @description Item que serão exibidos no menu
     */
    menuItems: MenuItem[]

    /**
     * @description Componente que será exibido no espaço do conteúdo
     */
    component: JSX.Element

    /**
     * @param component Define o componente que será exibido no espaço do conteúdo
     * @param menuItems Define os itens que serão exibidos no menu
     */
    constructor(menuItems: MenuItem[], component: JSX.Element) {
        this.menuItems = menuItems
        this.component = component
    }   
}