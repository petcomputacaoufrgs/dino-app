import React from 'react'
import ContentProps from './props'
import Day from './day'
import './styles.css'

const Content: React.FC<ContentProps> = ({ days, first }) => {
	const getClass = (): string => {
		return `calendar__month__content__week_day_column__content${
			first ? ' with_two_borders' : ''
		}`
	}

	return (
		<div className={getClass()}>
			{days.map((day, key) => (
				<Day key={key} day={day} />
			))}
		</div>
	)
}

export default Content
