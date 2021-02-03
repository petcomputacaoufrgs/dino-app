import React from 'react'
import PageNotFound from '../../assets/images/page_not_found.svg'
import { useLanguage } from '../../context/language'
import DinoLoader from '../../components/loader'
import './styles.css'
import { usePrivateRouter } from '../../context/private_router'
import AuthService from '../../services/auth/AuthService'

const redirectTimeout = 2000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound = (): JSX.Element => {

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
