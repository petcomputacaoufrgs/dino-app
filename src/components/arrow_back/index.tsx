import React from 'react'
import IconButton from '../../components/button/icon_button'
import HistoryService from '../../services/history/HistoryService'
import { ReactComponent as ArrowBackIconSVG } from '../../assets/icons/arrow_back.svg'
import { useUserSettings } from '../../context/provider/user_settings'

const ArrowBack = (): JSX.Element => {
  const userSettings = useUserSettings()

  const language = userSettings.service.getLanguage(userSettings)

  return (
    <IconButton
      className="arrow-back"
      ariaLabel={language.ARROW_BACK_ARIA_LABEL}
      icon={ArrowBackIconSVG}
      onClick={() => HistoryService.goBack()}
    />
  )
}

export default ArrowBack
