import React from 'react'
import NoteBodyColumnHeaderProps from './props'
import './styles.css'
import { ReactComponent as EditIcon } from '../../../../../../assets/icons/pen.svg'
import { ReactComponent as DeleteOutlineIcon } from '../../../../../../assets/icons/delete.svg'
import IconButton from '../../../../../../components/button/icon_button'

const NoteBodyColumnHeader: React.FC<NoteBodyColumnHeaderProps> = ({
	title,
	onEdit,
	onDelete,
}) => {
	return (
		<div className='note__note_content__column__column_header'>
			<h2>{title}</h2>
			<div className='note__note_content__column__column_header__button_div'>
				<IconButton
					icon={DeleteOutlineIcon}
					className='note__note_content__column__column_header__button_div__button'
					onClick={onDelete}
				/>
				<IconButton
					icon={EditIcon}
					className='note__note_content__column__column_header__button_div__button'
					onClick={onEdit}
				/>
			</div>
		</div>
	)
}

export default NoteBodyColumnHeader
