export default interface SVGButtonProps {
  onClick: () => void
  ariaLabel: string
  SVG: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >
  fab?: boolean
}
