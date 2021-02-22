import React from 'react'
import { InputAdornment, TextField, IconButton } from '@material-ui/core/'
import { Search } from '@material-ui/icons/'
import './styles.css'
import { useLanguage } from '../../context/language'

interface SearchBarProps {
	value: string
	onChange: (event: any) => void
	placeholder?: string
}

const MuiSearchBar = (props: SearchBarProps) => {

	const language = useLanguage()
	
	return (
		<div className='mui-search-bar'>
			<TextField
				id='outlined-helperText'
				fullWidth
				variant='outlined'
				value={props.value}
				onChange={props.onChange}
				aria-describedby='standard-weight-helper-text'
				size='small'
				placeholder={props.placeholder || language.data.SEARCH_HOLDER}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<IconButton>
								<Search />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</div>
	)
}

export default MuiSearchBar
