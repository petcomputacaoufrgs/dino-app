import React from 'react'
import AddColumnProps from './props'
import './styles.css'
import Button from '../../../../../components/button'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'
import { isMobile } from 'react-device-detect'
import NoteConstants from '../../../../../constants/note/NoteConstants'

const AddColumn: React.FC<AddColumnProps> = ({
  onAddColumn,
  visible,
  columnCount,
}) => {
  const language = useCurrentLanguage()

  const maxColumns = columnCount >= NoteConstants.MAX_COLUMNS

  return (
    <div
      className={`note__note_content__columns__add_column${
        isMobile ? '' : ' desktop'
      }`}
      style={{ visibility: visible ? 'inherit' : 'hidden' }}
    >
      <Button
        className="note__note_content__columns__add_column__button"
        onClick={onAddColumn}
        disabled={maxColumns}
      >
        <h2 className="note__note_content__columns__add_column__button__text">
          {language.ADD_COLUMN_TEXT} (
          <span
            className={
              maxColumns
                ? 'note__note_content__columns__add_column__button__text__max_columns'
                : ''
            }
          >
            {columnCount}/{NoteConstants.MAX_COLUMNS}
          </span>
          )
        </h2>
      </Button>
    </div>
  )
}

export default AddColumn
