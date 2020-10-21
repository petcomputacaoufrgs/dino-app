import React from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton'
import 'bootstrap/dist/css/bootstrap.min.css'
import HistoryService from '../../services/history/HistoryService'
import { useCurrentLanguage } from '../../context_provider/app_settings'
import './styles.css'

const ArrowBack = (props: {color?: "inherit" | "disabled" | "action" | "primary" | "secondary" | "error" | undefined}): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <IconButton
      className="arrow-back"
      aria-label={language.RETURN_ARIA_LABEL}
      onClick={() => HistoryService.goBack()}
    >
      <ArrowBackIcon color={props.color} />
    </IconButton>
  )
}

export default ArrowBack
