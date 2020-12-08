import React from 'react'
import IconButton from '../../components/button/icon_button'
import HistoryService from '../../services/history/HistoryService'
import { ReactComponent as ArrowBackIconSVG } from '../../assets/icons/arrow_back.svg'
import { useCurrentLanguage } from '../../context/provider/app_settings'

const ArrowBack = (): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <IconButton
      ariaLabel={language.ARROW_BACK_ARIA_LABEL}
      icon={ArrowBackIconSVG}
      onClick={() => HistoryService.goBack()}
    />
  )
}

export default ArrowBack
