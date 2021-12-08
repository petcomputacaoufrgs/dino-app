import { ReactComponent as PillSVG } from '../../assets/icons/general_use/pill.svg'
import { ReactComponent as ClockSVG } from '../../assets/icons/general_use/clock.svg'
import { ReactComponent as ClipboardSVG } from '../../assets/icons/general_use/clipboard.svg'
import { ReactComponent as EmptySVG } from '../../assets/icons/general_use/empty.svg'
import React from 'react'

type SVGType = React.FunctionComponent<
	React.SVGProps<SVGSVGElement> & {
		title?: string | undefined
	}
>

export const getIcon = (icon?: string) => {
	if (icon) {
		const icons = {
			blank: EmptySVG,
			pill: PillSVG,
			clipboard: ClipboardSVG,
			clock: ClockSVG,
		}
		return (icons[icon] as SVGType) || EmptySVG
	}
	return EmptySVG
}

export const getAllIcons = () => {
	const icons = [
		{
			name: 'blank',
			Icon: EmptySVG,
		},
		{ name: 'pill', Icon: PillSVG },
		{ name: 'clipboard', Icon: ClipboardSVG },
		{ name: 'clock', Icon: ClockSVG },
	]
	return icons
}
