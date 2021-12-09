import React from 'react'
import { useLanguage } from '../../context/language'

export const DinoRecord: React.FC<{ value: number }> = props => {
	const language = useLanguage()
	return (
		<div className='record_div'>
			{language.data.GAME_RECORD}: {props.value || '-'}
			{props.children}
		</div>
	)
}
