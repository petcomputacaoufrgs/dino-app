import MenuItem from '../../types/MenuItem'

/**
 * @description Propriedades do menu drawer.
 */
export default interface DrawerNavigationProps {
    /**
     * @description Item que serão exibidos no menu
     */
    items: MenuItem[]

    /**
     * @description Defini se o estado do menu quando fechado deve exibir um mini menu ou não
     */
    mini?: boolean

    /**
     * @description Componente com as views e as suas rotas
     */
    component: JSX.Element

    /**
     * @description Componente que ficará na barra superior
     */
    topBarComponent?: JSX.Element
}