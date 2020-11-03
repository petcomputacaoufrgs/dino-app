import React from 'react'
import { useCurrentLanguage } from '../../../../context_provider/app_settings'
import { useParams } from 'react-router-dom'
import {
  Divider,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import ArrowBack from '../../../../components/arrow_back'
import { useGlossary } from '../../../../context_provider/glossary'

const GlossaryItem = (): JSX.Element => {
  const { id } = useParams()

  const language = useCurrentLanguage()

  const items = useGlossary().items

  const item = items.find((item) => item.id === Number(id))

  return (
    <div className="glossary-item">
      <Card raised>
        <div
          style={{ paddingTop: '10px', paddingLeft: '10px', marginTop: '8px' }}
        >
          <ArrowBack />
        </div>
        <CardHeader
          title={item ? item.title : language.NO_AVAILABLE_TEXT}
          subheader={item ? item.subtitle : ''}
        />
        <Divider />
        <CardContent>
          <Typography paragraph component="text" variant="body1">
            {item?.fullText || language.NO_AVAILABLE_TEXT}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default GlossaryItem
