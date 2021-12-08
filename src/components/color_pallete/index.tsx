import React from 'react'
import Popover from '@material-ui/core/Popover'
import PaletteIcon from '@material-ui/icons/Palette'
import DinoIconButton from '../button/icon_button'
import { useLanguage } from '../../context/language'
import './styles.css'
import ColorConstants from '../../constants/app/ColorConstants'
import DinoHr from '../dino_hr'

export const ColorPalette: React.FC<{
	onClick: (color?: number) => void
	anchorEl: HTMLButtonElement | null
	onClose: () => void
}> = ({ onClick, anchorEl, onClose, children }) => {
	const renderColorOption = (index: number, c?: number) => (
		<div
			key={index}
			tabIndex={index}
			className={`color_palette__color_option dino_icon__color-${c}`}
			onClick={() => onClick(c)}
		/>
	)

	return (
		<div className='color_palette'>
			{children}
			<Popover
				className='color_palette__popover'
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={onClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<div className='color_palette__popover__wrapper'>
					<div className='color_palette__popover__options'>
						{ColorConstants.THEME_COLORS.map((c, index) =>
							renderColorOption(index, c),
						)}
					</div>
					<DinoHr />
					<div className='color_palette__popover__options'>
						{ColorConstants.COLORS.map((c, index) =>
							renderColorOption(index, c),
						)}
					</div>
				</div>
			</Popover>
		</div>
	)
}

export const ChooseColorIconButton: React.FC<{
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ onClick }) => {
	const language = useLanguage()

	return (
		<DinoIconButton
			ariaLabel={language.data.COLOR_THEME_SELECTION_ARIA_LABEL}
			icon={PaletteIcon}
			onClick={onClick}
		/>
	)
}
