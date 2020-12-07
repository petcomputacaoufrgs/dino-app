import 'bootstrap/dist/css/bootstrap.min.css'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import './styles.css'
import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import PathConstants from '../../../../constants/app/PathConstants'
import { Link } from 'react-router-dom'
import GlossaryItemProps from './props'

const GlossaryItems = ({ items }: GlossaryItemProps): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <div className="glossary__items">
      <Accordion className="accordion">
        {items.map((item, index) => (
          <Card className="card" key={item.id}>
            <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
              <Card.Title className="card-title">{item.title}</Card.Title>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>
                <Card.Subtitle className="mb-2">
                  {item.subtitle}
                </Card.Subtitle>
                <Card.Text>{item.text || language.NO_AVAILABLE_TEXT}</Card.Text>
                <Link
                  className="card-link"
                  to={`${PathConstants.GLOSSARY}/${item.id}`}
                >
                  {language.READ_MORE}
                </Link>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  )
}

export default GlossaryItems
