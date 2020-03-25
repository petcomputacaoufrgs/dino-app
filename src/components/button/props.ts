import MouseEvent from '../../types/MouseEvent'

export default class ButtonProps{
    onClick: MouseEvent
    disabled?: boolean | undefined
    children: any

    constructor(onClick: MouseEvent, disabled: boolean | undefined, children: any) {
        this.onClick = onClick
        this.disabled = disabled
        this.children = children
    }
}