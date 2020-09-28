import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'

/**
 * @description Propriedades do menu de navegação inferior
 */
export default interface BottomNavigationProps {
  /**
   * @description Item que serão exibidos no menu
   */
  groupedItems: MenuItemViewModel[][]
  
  /**
   * @description Componente com as views e as suas rotas
   */
  component: JSX.Element

  /**
   * @description Exibe um mini menu lateral
   */
  showMiniDrawer?: boolean
}
