import MouseEvent from '../../types/MouseEvent'

/**
 * @description Propriedades do botão
 */
export default class ButtonProps{
    onClick: MouseEvent
    disabled?: boolean | undefined
    children: any

    /**
     * 
     * @param onClick Função disparada no evento de clique
     * @param disabled Define se o botão está ativo
     * @param children Define o conteúdo que deve ser exibido dentro do botão
     */
    constructor(onClick: MouseEvent, disabled: boolean | undefined, children: any) {
        this.onClick = onClick
        this.disabled = disabled
        this.children = children
    }
}