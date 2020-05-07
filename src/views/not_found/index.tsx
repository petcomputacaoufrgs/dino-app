import React from 'react'
import { useLanguage } from '../../provider/app_provider'
import PageNotFound from '../../images/page-not-found.svg'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/PathConstants'
import './styles.css'

const redirectTimeout = 2000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound = (): JSX.Element => {
  const language = useLanguage().currentLanguage

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
