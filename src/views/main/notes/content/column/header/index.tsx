import React from 'react'
import NoteBodyColumnHeaderProps from './props'
import './styles.css'
import { ReactComponent as EditIcon } from '../../../../../../assets/icons/edit.svg'
import { ReactComponent as DeleteOutlineIcon } from '../../../../../../assets/icons/delete_outline.svg'
import SVGButton from '../../../../../../components/button/svg_button'
import { useLanguage } from '../../../../../../context_provider/app_settings'

const NoteBodyColumnHeader: React.FC<NoteBodyColumnHeaderProps> = ({
  title,
  onEdit,
  onDelete,
}) => {
  const language = useLanguage().current

  return (
    <div className="note__note_content__column__column_header">
      <h2>{title}</h2>
      <div className="note__note_content__column__column_header__button">
        <SVGButton
          SVG={DeleteOutlineIcon}
          ariaLabel={language.DELETE_ARIA_LABEL}
          onClick={onDelete}
        />
        <SVGButton
          SVG={EditIcon}
          ariaLabel={language.EDIT_ARIA_LABEL}
          onClick={onEdit}
        />
      </div>
    </div>
  )
}

export default NoteBodyColumnHeader
