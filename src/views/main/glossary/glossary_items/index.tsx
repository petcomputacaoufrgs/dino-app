import 'bootstrap/dist/css/bootstrap.min.css'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import './styles.css'
import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import PathConstants from '../../../../constants/app/PathConstants'
import { Link } from 'react-router-dom'
import GlossaryItemProps from './props'

const GlossaryItems = (props: GlossaryItemProps): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <Accordion className="accordion">
      {props.items.map((item) => (
        <Card className="card" key={item.id}>
          <Accordion.Toggle as={Card.Header} eventKey={item.id.toString()}>
            <Card.Title className="accordion-card-title">
              {item.title}
            </Card.Title>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={item.id.toString()}>
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                {item.subtitle}
              </Card.Subtitle>
              <Card.Text>{item.text || language.NO_AVAILABLE_TEXT}</Card.Text>
              <Link to={`${PathConstants.GLOSSARY}/${item.id}`}>Leia Mais</Link>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  )
}

export default GlossaryItems
