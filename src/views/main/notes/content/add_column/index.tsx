import React from 'react'
import AddColumnProps from './props'
import './styles.css'
import { useLanguage } from '../../../../../context_provider/app_settings'

const AddColumn: React.FC<AddColumnProps> = ({ onAddColumn }) => {
    const language = useLanguage().current

    return (
        <button className="note__note_content__columns__add_column" onClick={onAddColumn}>
            <p className="note__note_content__columns__add_column__text">{language.ADD_COLUMN_TEXT}</p>
        </button>
    )
}

export default AddColumn