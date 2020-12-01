import ButtonProps from '../props'

export default interface TextIconButtonProps extends ButtonProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}
