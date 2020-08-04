import React from 'react'
import TagSearchBar from '../../../../components/tag_search_bar'
import NoteSVG from '../../../../assets/icons/note.svg'
import { isMobile } from 'react-device-detect'
import { useLanguage } from '../../../../provider/app_settings_provider'
import './styles.css'

const NoteHeader = (props: {
  tags: string[]
  handleTagSearch: (tags: string[]) => void
  handleTextSearch: (text: string) => void
  headerClass: string
}) => {
  const language = useLanguage().current

  return (
    <div className={isMobile ? 'notes__header' : 'notes__header_desktop'}>
      <img
        className="notes__header__image"
        src={NoteSVG}
        alt={language.NOTES_HEADER_IMAGE_DESC}
      />
      <TagSearchBar
        options={props.tags}
        onTagSearch={props.handleTagSearch}
        onTextSearch={props.handleTextSearch}
        textFieldClass={props.headerClass}
      />
    </div>
  )
}

export default NoteHeader
