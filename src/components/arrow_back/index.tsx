import React from 'react'
import IconButton from '../../components/button/icon_button'
import 'bootstrap/dist/css/bootstrap.min.css'
import HistoryService from '../../services/history/HistoryService'
import {ReactComponent as ArrowBackIconSVG} from '../../assets/icons/arrow_back.svg'

const ArrowBack = (): JSX.Element => {
  return (
    <IconButton
      icon={ArrowBackIconSVG}
      onClick={() => HistoryService.goBack()}
    />
  )
}

export default ArrowBack
