import React from 'react'
import NoteBodyColumnHeaderProps from './props'
import './styles.css'

const NoteBodyColumnHeader: React.FC<NoteBodyColumnHeaderProps> = ({
    title
}) => {
    return (
        <div className="note__note_content__column__column_header">
            <h2>{title}</h2>
        </div>
    )
}

export default NoteBodyColumnHeader