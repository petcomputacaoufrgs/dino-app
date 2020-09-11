import './styles.css'
import React from 'react'
import FaqItemsProps from './props'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
//import 'bootstrap/dist/css/bootstrap.min.css'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'

const FaqItems = ({ items, title }: FaqItemsProps): JSX.Element => {
  return (
    <div className="faq-items">
      <div className="faq-items__title">
        <Typography>{title}</Typography>
        <Divider />
      </div>

      <Accordion className="faq-items__accordion">
        {items.map((item) => (
          <Card className="card" key={item.id}>
            <Accordion.Toggle as={Card.Header} eventKey={item.id.toString()}>
              <Typography>{item.question}</Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={item.id.toString()}>
              <Card.Body>
                <Card.Text>{item.answer}</Card.Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  )
}

export default FaqItems
