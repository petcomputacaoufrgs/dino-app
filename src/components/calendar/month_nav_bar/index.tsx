import { ArrowForward } from '@material-ui/icons'
import ArrowBack from '@material-ui/icons/ArrowBack'
import React, { useState } from 'react'
import { useLanguage } from '../../../context/language'
import DateUtils from '../../../utils/DateUtils'
import DinoIconButton from '../../button/icon_button'
import './styles.css'

const MonthNavBar: React.FC<{
	date: Date
	handleChangeDate: (currentDate: Date) => void
}> = props => {
	const language = useLanguage()

	const clickPrevious = () => {
		const currentDate = DateUtils.getLastMonth(props.date)
		props.handleChangeDate(currentDate)
	}

	const clickNext = () => {
		const currentDate = DateUtils.getNextMonth(props.date)
		props.handleChangeDate(currentDate)
	}

	return (
		<div className='month_nav_bar_wrapper dino__flex_row'>
			<DinoIconButton icon={ArrowBack} onClick={clickPrevious}></DinoIconButton>
			<div className='month_and_year_wrapper'>
				<div className='month_and_year_text'>
					{DateUtils.getMonthName(props.date.getMonth(), language.data)}{' '}
					{props.date.getFullYear()}
				</div>
			</div>
			<DinoIconButton icon={ArrowForward} onClick={clickNext}></DinoIconButton>
		</div>
	)
}

export default MonthNavBar
