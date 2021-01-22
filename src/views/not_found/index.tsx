import React from 'react'
import PageNotFound from '../../assets/images/page_not_found.svg'
import { useLanguage } from '../../context/language'
import Loader from '../../components/loader'
import './styles.css'
import { usePrivateRouter } from '../../context/private_router'
import MenuService from '../../services/menu/MenuService'

const redirectTimeout = 2000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound = (): JSX.Element => {

	const router = usePrivateRouter()

	const language = useLanguage()

	const redirectToHome = () => {
		MenuService.redirectToHome(router.userPermission)
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
