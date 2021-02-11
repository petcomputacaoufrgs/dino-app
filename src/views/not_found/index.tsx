import React from 'react'
import PageNotFound from '../../assets/icons/page_not_found.svg'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import { useLanguage } from '../../context/language'
import DinoLoader from '../../components/loader'
import './styles.css'
import { usePrivateRouter } from '../../context/private_router'
import AuthService from '../../services/auth/AuthService'

const redirectTimeout = 2000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound: React.FC = () => {
	const language = useLanguage()

	const router = usePrivateRouter()

	const language = useLanguage()

	setTimeout(() => AuthService.redirectToHome(router.userPermission), redirectTimeout)

	return (
		<DinoLoader isLoading={language.loading}>
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
		</DinoLoader>
	)
}

export default NotFound
