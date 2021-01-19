import React from 'react'
import TagSearchBar from '../../../../components/tag_search_bar'
import NoteHeaderProps from './props'
import './styles.css'

const NoteHeader: React.FC<NoteHeaderProps> = ({
	tags,
	onTagSearch,
	onTextSearch,
}) => {
	return (
		<div className='notes__header'>
			<TagSearchBar
				options={tags}
				onTagSearch={onTagSearch}
				onTextSearch={onTextSearch}
			/>
		</div>
	)
}

export default NoteHeader
