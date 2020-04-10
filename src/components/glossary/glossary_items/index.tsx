import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import React from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import PathConstants from '../../../constants/PathConstants';
import { Link } from 'react-router-dom'
//import { useParams } from 'react-router-dom'

//destructuring props into glossary
const GlossaryItems = ({ items }): JSX.Element => 
    <Accordion className="accordion">
        {items.map(item =>
            <Card className="card" key={item.id}>
                <Accordion.Toggle as={Card.Header} eventKey={item.id}>
                    <Card.Title className="accordion-card-title">{item.title}</Card.Title>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={item.id}>
                    <Card.Body>
                        <Card.Subtitle className="mb-2 text-muted">{"Aqui vai a tag"}</Card.Subtitle>
                        <Card.Text>{item.text}</Card.Text>
                        <Link to={`${PathConstants.GLOSSARY}/${item.id}`}>Leia Mais</Link>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>)}
    </Accordion>


export default GlossaryItems