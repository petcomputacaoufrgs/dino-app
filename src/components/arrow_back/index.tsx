import React from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton'
import 'bootstrap/dist/css/bootstrap.min.css'
import HistoryService from '../../services/history/HistoryService'
import './styles.css'

const ArrowBack = (): JSX.Element => {
  return (
    <IconButton
      className="arrow-back"
      aria-label="voltar"
      onClick={() => HistoryService.goBack()}
    >
      <ArrowBackIcon color="action" />
    </IconButton>
  )
}

export default ArrowBack
