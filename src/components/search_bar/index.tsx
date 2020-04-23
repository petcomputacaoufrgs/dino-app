import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import SearchBarProps from './props'
import './styles.css'

const SearchBar = (props: SearchBarProps): JSX.Element => {

    const handleChange = (event: React.ChangeEvent<{}>, values: any) => {
        props.onSearch(values)
    }

    return (
        <Autocomplete
            multiple
            options={props.options}
            getOptionLabel={(option) => option}
            className='search_bar'
            style={{ maxHeight: 50 }}
            onChange={handleChange}
            renderInput={(params) => 
                <TextField {...params} 
                    className={props.textFieldClass}
                    label="Dar nome" 
                    variant="outlined" />
            }
        />
    )
}

export default SearchBar

