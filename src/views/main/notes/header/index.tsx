import React from 'react'
import TagSearchBar from '../../../../components/tag_search_bar'
import { ReactComponent as NoteSVG } from '../../../../assets/icons/menu_icons/note.svg'
import { useCurrentLanguage } from '../../../../context_provider/app_settings'
import NoteHeaderProps from './props'
import './styles.css'

const NoteHeader: React.FC<NoteHeaderProps> = ({
  tags,
  onTagSearch,
  onTextSearch,
}) => {
  const language = useCurrentLanguage()

  return (
    <div className="notes__header">
      <NoteSVG title={language.NOTES_HEADER_IMAGE_DESC} className='notes__header__image'/>
      <TagSearchBar
        options={tags}
        onTagSearch={onTagSearch}
        onTextSearch={onTextSearch}
      />
    </div>
  )
}

export default NoteHeader
