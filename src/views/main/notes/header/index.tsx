import React from 'react'
import TagSearchBar from '../../../../components/tag_search_bar'
import { isMobile } from 'react-device-detect'
import './styles.css'

const NoteHeader = (props: {
  tags: string[]
  handleTagSearch: (tags: string[]) => void
  handleTextSearch: (text: string) => void
  headerClass: string
}) => {

  return (
    <div className={isMobile ? 'notes__header' : 'notes__header_desktop'}>
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
