import React from 'react'
import NoteBodyColumnHeaderProps from './props'
import './styles.css'
import { ReactComponent as EditIcon } from '../../../../../../assets/icons/edit.svg'
import SVGButton from '../../../../../../components/button/svg_button'

const NoteBodyColumnHeader: React.FC<NoteBodyColumnHeaderProps> = ({
    title,
    onEdit
}) => {
    return (
        <div className="note__note_content__column__column_header">
            <h2>{title}</h2>
            <div className="note__note_content__column__column_header__button">
                <SVGButton
                    SVG={EditIcon}
                    ariaLabel={''}
                    onClick={onEdit}
                />
            </div>
        </div>
    )
}

export default NoteBodyColumnHeader