import ButtonProps from '../props'

export default interface CircularButtonProps extends ButtonProps {
	icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}
