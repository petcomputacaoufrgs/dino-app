/**
 * @description Descreve o formato de cada item do Menu
 */
interface MenuItemViewModel {
  /**
   * @description Define o icone que será exibido no menu
   */
  image: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >

  /**
   * @description Define o texto que será exibido no menu aberto
   */
  name: string

  /**
   * @description Define uma função que será chamada quando o item for selecionado
   */
  onClick: () => void
}

export default MenuItemViewModel
