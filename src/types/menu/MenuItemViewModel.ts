interface MenuItemViewModel {
	image?: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined
		}
	>

	name: string

	onClick: () => void
}

export default MenuItemViewModel
