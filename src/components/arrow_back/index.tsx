import React from 'react'
import DinoIconButton from '../../components/button/icon_button'
import HistoryService from '../../services/history/HistoryService'
import { ReactComponent as ArrowBackIconSVG } from '../../assets/icons/arrow_back.svg'
import { useLanguage } from '../../context/language'

const ArrowBack: React.FC<{	lum?: "dark" | "light" }> = (props)=> {
	const language = useLanguage()

	return (
		<DinoIconButton
			className={'arrow_back'}
			ariaLabel={language.data.ARROW_BACK_ARIA_LABEL}
			icon={ArrowBackIconSVG}
			onClick={() => HistoryService.goBack()}
			lum={props.lum}
		/>
	)
}

export default ArrowBack
