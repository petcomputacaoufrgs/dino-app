import React from 'react'
import TagSearchBar from '../../../../components/tag_search_bar'
import NoteSVG from '../../../../assets/icons/note.svg'
import { useLanguage } from '../../../../context_provider/app_settings'
import NoteHeaderProps from './props'
import './styles.css'

const NoteHeader: React.FC<NoteHeaderProps> = ({
  tags,
  onTagSearch,
  onTextSearch,
}) => {
  const language = useLanguage().current

  return (
    <div className="notes__header">
      <img
        className="notes__header__image"
        src={NoteSVG}
        alt={language.NOTES_HEADER_IMAGE_DESC}
      />
      <TagSearchBar
        options={tags}
        onTagSearch={onTagSearch}
        onTextSearch={onTextSearch}
      />
    </div>
  )
}

export default NoteHeader
