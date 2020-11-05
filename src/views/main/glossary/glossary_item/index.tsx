import React from 'react'
import { useCurrentLanguage } from '../../../../context_provider/app_settings'
import { useParams } from 'react-router-dom'
import { Divider, Paper } from '@material-ui/core'
import './styles.css'
import { useGlossary } from '../../../../context_provider/glossary'

const GlossaryItem = (): JSX.Element => {
  const { id } = useParams()

  const language = useCurrentLanguage()

  const items = useGlossary().items

  const item = items.find((item) => item.id === Number(id))

  return (
    <div className="glossary-item">
      <Paper elevation={5}>
        <div className="card__header" >
          <div className='card__header__title'>
            {item ? item.title : language.NO_AVAILABLE_TEXT}
          </div>
          <div className='card__typography muted'>
            {item ? item.subtitle : ''}
          </div>
        </div>
        <Divider/>
        <div className="card__content" >
          <div className='card__typography'>
            {item?.fullText || language.NO_AVAILABLE_TEXT}
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default GlossaryItem
