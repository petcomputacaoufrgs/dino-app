import React from 'react'
import { useLanguage } from '../../../../context_provider/app_settings'
import { useParams } from 'react-router-dom'
//import Card from 'react-bootstrap/Card'
import { Divider, Card, CardContent, CardHeader, Typography } from '@material-ui/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import ArrowBack from '../../../../components/arrow_back'
import { useGlossary } from '../../../../context_provider/glossary'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';


const GlossaryItem = (): JSX.Element => {

  const { id } = useParams()

  const language = useLanguage().current

  const items = useGlossary().items

  const item = items.find((item) => item.id === Number(id))

  return (
    <div className="glossary-item">
      <Card raised>
        <div style={{paddingTop:'10px', paddingLeft:'10px', marginTop:'8px'}}>
          <ArrowBack />
        </div>
        <CardHeader 
          title={item ? item.title : language.NO_AVAILABLE_TEXT} 
          subheader={item ? item.subtitle : ''}
        />
        <Divider/>
        <CardContent>
          <Typography paragraph component='text' variant='body1'>
            {item?.fullText || language.NO_AVAILABLE_TEXT}
          </Typography>
        </CardContent>
      </Card>
      {/*
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
      */}
    </div>
  )
}

export default GlossaryItem
