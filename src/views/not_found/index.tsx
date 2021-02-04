import React from 'react'
import PageNotFound from '../../assets/icons/page_not_found.svg'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import { useLanguage } from '../../context/language'
import Loader from '../../components/loader'
import './styles.css'

const redirectTimeout = 2000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound: React.FC = () => {
	const language = useLanguage()

	const redirectToHome = () => {
		HistoryService.push(PathConstants.HOME)
	}

	setTimeout(redirectToHome, redirectTimeout)

	return (
		<Loader isLoading={language.loading}>
			<div className='not_found'>
				<p className='not_found__text'>
					{language.data.NOT_FOUND_MESSAGE} &nbsp; :(
				</p>
				<p className='not_found__text'>
					{language.data.NOT_FROND_REDIRECT_MESSAGE}
				</p>
				<img
					className='not_found__image'
					src={PageNotFound}
					alt='Página não encontrada'
				/>
			</div>
		</Loader>
	)
}

export default NotFound
