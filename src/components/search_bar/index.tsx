import React, { useContext } from 'react'
import { LanguageContext } from '../language_provider'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import SearchBarProps from './props'
import './styles.css'

const SearchBar = (props: SearchBarProps): JSX.Element => {

    const languageProvider = useContext(LanguageContext)
    const language = languageProvider.currentLanguage

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
                    label={language.SEARCH_BUTTON_LABEL}
                    variant="outlined" />
            }
        />
    )
}

export default SearchBar

