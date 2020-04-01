import MenuItemOnClick from './MenuItemOnClick'

/**
 * @description Descreve o formato de cada item do Menu
 */
type MenuItem = {
    /**
     * @description Define o icone que será exibido no menu
     */
    image: any 

    /**
     * @description Define o texto que será exibido no menu aberto
     */
    name: string 
    
    /**
     * @description Define uma função que será chamada quando o item for selecionado
     */
    onClick: MenuItemOnClick

}

export default MenuItem