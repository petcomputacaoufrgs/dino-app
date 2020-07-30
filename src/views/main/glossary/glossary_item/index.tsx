import React from 'react'
import { useLanguage } from '../../../../context_provider/app_settings'
import { useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import ArrowBack from '../../../../components/arrow_back'
import { useGlossary } from '../../../../context_provider/glossary'

const GlossaryItem = (): JSX.Element => {
  const { id } = useParams()

  const language = useLanguage().current

  const items = useGlossary().items

  const item = items.find((item) => item.id === Number(id))

  return (
    <div className="glossary-item">
      <ArrowBack />
      <Card className="card">
        <Card.Header>
          <Card.Title>
            {item ? item.title : language.NO_AVAILABLE_TEXT}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted">
            {item ? item.text : ''}
          </Card.Subtitle>
          <Card.Text>
            {item ? item.fullText : language.NO_AVAILABLE_TEXT}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default GlossaryItem
