import React from 'react'
import PageNotFound from '../../assets/images/page_not_found.svg'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import { useUserSettings } from '../../context/provider/user_settings'
import './styles.css'

const redirectTimeout = 2000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound = (): JSX.Element => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)

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
