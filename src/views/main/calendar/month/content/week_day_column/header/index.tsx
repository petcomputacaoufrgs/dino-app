import React from 'react'
import HeaderProps from './props'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ shortName, first }) => {
	const getBarClass = (): string => {
		return `calendar__month__content__week_day_column__header__separation_bar`
	}

	return (
		<div className='calendar__month__content__week_day_column__header'>
			<div className='calendar__month__content__week_day_column__header__info'>
				{first && <div className={getBarClass()} />}
				<h2>{shortName}</h2>
				<div className={getBarClass()} />
			</div>
		</div>
	)
}

export default Header
