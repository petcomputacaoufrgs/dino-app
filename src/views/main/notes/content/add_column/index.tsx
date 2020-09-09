import React from 'react'
import AddColumnProps from './props'
import './styles.css'
import { useLanguage } from '../../../../../context_provider/app_settings'
import { Button } from '@material-ui/core'
import { isMobile } from 'react-device-detect'

const AddColumn: React.FC<AddColumnProps> = ({ onAddColumn }) => {
    const language = useLanguage().current

    return (
        <>
        <Button className={`note__note_content__columns__add_column${!isMobile ? ' desktop' : ''}`} onClick={onAddColumn}>
            <p className="note__note_content__columns__add_column__text">
                {language.ADD_COLUMN_TEXT}
            </p>
        </Button>
        </>
    )
}

export default AddColumn