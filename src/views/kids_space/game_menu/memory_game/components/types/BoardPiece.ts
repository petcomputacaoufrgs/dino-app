export default interface BoardPiece {
    image: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    turned: boolean
    visible: boolean
}