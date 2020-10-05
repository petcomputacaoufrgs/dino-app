import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'

/**
 * @description Propriedades do menu drawer.
 */
export default interface AdaptableMenuProps {
  /**
   * @description Componente com os itens do menu
   */
  component: JSX.Element

  /**
   * @description Lista com listas de itens organizados por grupo,
   * no caso do menu inferior a primeira lista será exibida na parte inferior.
   */
  groupedItems: MenuItemViewModel[][]

  /**
   * @description Componente que será colocado na barra superior
   */
  topBarComponent?: JSX.Element
}
