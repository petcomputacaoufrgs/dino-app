import React from 'react'
import { MoreVert } from '@material-ui/icons'
import OptionsIconButtonProps from './props'
import { ReactComponent as MoreSVG } from '../../../../assets/icons/more_vert.svg'
import DinoIconButton from '..'
import { useLanguage } from '../../../../context/language'
import './styles.css'

const OptionsIconButton: React.FC<OptionsIconButtonProps> = ({
	onClick,
	lum,
	bigger,
}) => {
	const language = useLanguage()

	return (
		<DinoIconButton
			className='icon_button__options'
			icon={MoreSVG}
			ariaLabel={language.data.OPTIONS_ARIA_LABEL}
			onClick={onClick}
			lum={lum}
			bigger={bigger}
		>
			<MoreVert />
		</DinoIconButton>
	)
}

export default OptionsIconButton
