import React from 'react'
import './styles.css'
import NotesContentColumnAddNoteProps from './props'
import { Button } from '@material-ui/core'
import { useLanguage } from '../../../../../../context_provider/app_settings'

const NotesContentColumnAddNote: React.FC<NotesContentColumnAddNoteProps> = ({
    onAdd
}) => {
    const language = useLanguage().current
    
    return (
        <Button className="note__note_content__column__add_note" onClick={onAdd}>
            <h3>+ {language.NOTE_COLUMN_ADD_NOTE_TEXT}</h3>
        </Button>
    )
}

export default NotesContentColumnAddNote