import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'
import DateUtils from '../../../utils/DateUtils'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import StringUtils from '../../../utils/StringUtils'

interface SelectDateProps {
	value: Date
	onChange(date: Date): void
}

const SelectDate: React.FC<SelectDateProps> = props => {
	const language = useLanguage()

	const dayList = Array.from({ length: 31 }, (_, i) => `${i + 1}`)
	const monthList = DateUtils.getMonthNames(language.data)
	const yearList = ['2021', '2022', '2023', '2024', '2025']

	const [dayInput, setDayInput] = useState('')
	const [monthInput, setMonthInput] = useState('')
	const [yearInput, setYearInput] = useState('')
	
	const handleChangeDay = e => {
		if(e.target.value){
			props.value.setDate(Number(e.target.value))
			props.onChange(props.value)
		}
	}

	const handleChangeMonth = e => {
		if(e.target.value){
			props.value.setMonth(Number(e.target.value))
			props.onChange(props.value)
		}
	}

	const handleChangeYear = e => {
		if(e.target.value){
			props.value.setMinutes(Number(e.target.value))
			props.onChange(props.value)
		}
	}

	console.log(props.value)

	return (
		<div>
			<div className='date__selector'>
				<InputLabel shrink>{language.data.EVENT_DATE_ICON_ALT}</InputLabel>
			</div>
			<div className='.container-fluid'>
				<div className='row'>
					<div className='col-3 day_date__selector'>
						<Autocomplete
							value={dayInput}
							disableClearable
							onInputChange={(event, newInputValue) => setDayInput(newInputValue)}
							options={dayList}
							noOptionsText={''}
							onChange={handleChangeDay}
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
							value={monthInput}
							disableClearable
							onInputChange={(event, newInputValue) => setMonthInput(newInputValue)}
							options={monthList}
							noOptionsText={''}
							onChange={handleChangeMonth}
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
							value={yearInput}
							disableClearable
							onInputChange={(event, newInputValue) => setYearInput(newInputValue)}
							options={yearList}
							noOptionsText={''}
							onChange={handleChangeYear}
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
