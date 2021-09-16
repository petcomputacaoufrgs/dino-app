import React from 'react'
import Popover from '@material-ui/core/Popover'
import PaletteIcon from '@material-ui/icons/Palette'
import DinoIconButton from '../button/icon_button'
import { useLanguage } from '../../context/language'
import './styles.css'

export const ColorPalette: React.FC<{
	colors: string[]
	onClick: (color: string) => void
	anchorEl: HTMLButtonElement | null
	onClose: () => void
}> = ({ colors, onClick, anchorEl, onClose, children }) => {
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
				{colors.map((c, index) => (
					<div
						key={index}
						tabIndex={index}
						className='color_palette__color_option'
						style={{ backgroundColor: c }}
						onClick={() => onClick(c)}
					/>
				))}
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
