import React from 'react'
import { useLanguage } from '../../context_provider/app_settings'
import PageNotFound from '../../assets/images/page_not_found.svg'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import './styles.css'

const redirectTimeout = 2000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound = (): JSX.Element => {
  const language = useLanguage().current

  const redirectToHome = () => {
    HistoryService.push(PathConstants.HOME)
  }

  setTimeout(redirectToHome, redirectTimeout)

  return (
    <div className="not_found">
      <p className="not_found__text">{language.NOT_FOUND_MESSAGE} &nbsp; :(</p>
      <p className="not_found__text">{language.NOT_FROND_REDIRECT_MESSAGE}</p>
      <img
        className="not_found__image"
        src={PageNotFound}
        alt="Página não encontrada"
      />
    </div>
  )
}

export default NotFound
