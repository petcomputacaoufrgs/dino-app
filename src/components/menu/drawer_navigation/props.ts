import MenuItemViewModel from '../model/MenuItemViewModel'

/**
 * @description Propriedades do menu drawer.
 */
export default interface DrawerNavigationProps {
  /**
   * @description Itens que serão exibidos na parte superior do menu
   */
  groupedItems: MenuItemViewModel[][]

  /**
   * @description Define se o estado do menu quando fechado deve exibir um mini menu ou não
   */
  mini?: boolean

  /**
   * @description Componente com as views e as suas rotas
   */
  component?: JSX.Element
}
