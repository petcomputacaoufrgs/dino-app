import ButtonProps from "../props"

export default interface IconButtonProps extends ButtonProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    dark?: boolean
    bigger?: boolean 
}
