import React from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowUpward'
import IconButton from '@material-ui/core/IconButton'
import 'bootstrap/dist/css/bootstrap.min.css'
import HistoryService from '../../services/history/HistoryService'
import { useCurrentLanguage } from '../../context_provider/app_settings'

const ArrowBack = (): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <IconButton
      color="inherit"
      aria-label={language.RETURN_ARIA_LABEL}
      onClick={() => HistoryService.goBack()}
    >
      <ArrowBackIcon />
    </IconButton>
  )
}

export default ArrowBack
