import React from 'react'
import { InputLabel } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'
import DateUtils from '../../../utils/DateUtils'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

interface SelectDateProps {
	value: Date
	onChange(date: Date): void
}

const SelectDate: React.FC<SelectDateProps> = props => {
	const language = useLanguage()

	const dayList = Array.from({ length: 31 }, (_, i) => `${i + 1}`)
	const monthList = DateUtils.getMonthNames(language.data)
	const yearList = ['2021', '2022', '2023', '2024', '2025']

	const handleChangeDay = (value: string) => {
		props.value.setDate(Number(value))
		props.onChange(props.value)
	}

	const handleChangeMonth = (value: number) => {
		props.value.setMonth(value)
		props.onChange(props.value)
	}

	const handleChangeYear = (value: string) => {
		props.value.setMinutes(Number(value))
		props.onChange(props.value)
	}

	return (
		<div>
			<div className='date__selector'>
				<InputLabel shrink>{language.data.EVENT_DATE_ICON_ALT}</InputLabel>
			</div>
			<div className='.container-fluid'>
				<div className='row'>
					<div className='col-3 day_date__selector'>
						<Autocomplete
							value={props.value.getDate().toString()}
							onChange={(event, newInputValue) => {
								if (newInputValue) {
									const entity = dayList.find(day => day === newInputValue)
									if (entity) handleChangeDay(entity)
								}
							}}
							options={dayList}
							disableClearable
							noOptionsText={language.data.NO_OPTIONS}
							renderInput={params => (
								<TextField
									{...params}
									label={language.data.DAY}
									variant='standard'
									InputProps={{
										...params.InputProps,
										endAdornment: <>{params.InputProps.endAdornment}</>,
									}}
								/>
							)}
						/>
					</div>
					<div className='col-5 month_date__selector'>
						<Autocomplete
							value={monthList[props.value.getMonth()]}
							disableClearable
							onChange={(event, newInputValue) => {
								if (newInputValue) {
									const index = monthList.findIndex(
										value =>
											value.toLowerCase() === newInputValue.toLowerCase(),
									)
									if (index > -1) handleChangeMonth(index)
								}
							}}
							options={monthList}
							noOptionsText={language.data.NO_OPTIONS}
							renderInput={params => (
								<TextField
									{...params}
									label={language.data.MONTH}
									variant='standard'
									InputProps={{
										...params.InputProps,
										endAdornment: <>{params.InputProps.endAdornment}</>,
									}}
								/>
							)}
						/>
					</div>
					<div className='col-4 year_date__selector'>
						<Autocomplete
							value={props.value.getFullYear().toString()}
							disableClearable
							onChange={(event, newInputValue) => {
								if (newInputValue) {
									const entity = yearList.find(value => value === newInputValue)
									if (entity) handleChangeYear(entity)
								}
							}}
							options={yearList}
							noOptionsText={language.data.NO_OPTIONS}
							renderInput={params => (
								<TextField
									{...params}
									label={language.data.YEAR}
									variant='standard'
									InputProps={{
										...params.InputProps,
										endAdornment: <>{params.InputProps.endAdornment}</>,
									}}
								/>
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SelectDate
