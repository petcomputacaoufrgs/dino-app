import React from 'react'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import { useParams } from 'react-router-dom'
import { Divider, Paper } from '@material-ui/core'
import './styles.css'
import { useGlossary } from '../../../../context/provider/glossary'

interface RouterParams {
  id: string
}

const GlossaryItem: React.FC = () => {
  const { id } = useParams<RouterParams>()

  const language = useCurrentLanguage()

  const glossary = useGlossary()

  const item = glossary.data.find((item) => item.id === Number(id))

  return (
    <div className="glossary-item">
      <Paper elevation={1}>
        <div className="card__header">
          <div className="card__header__title">
            {item ? item.title : language.NO_AVAILABLE_TEXT}
          </div>
          <div className="card__typography muted">
            {item ? item.subtitle : ''}
          </div>
        </div>
        <Divider />
        <div className="card__content">
          <div className="card__typography">
            {item?.fullText || language.NO_AVAILABLE_TEXT}
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default GlossaryItem
