import React from 'react';
import { useParams} from 'react-router-dom'
import Glossary from '../../../views/glossary'
import Card from 'react-bootstrap/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import ArrowBack from '../../../components/arrow_back'

const GlossaryItem = (): JSX.Element => {
    const { id } = useParams()
    
    const item = Glossary.items.find(
        item => item.id === Number(id)
    )

    return (
        <div className="glossary-item">
        <ArrowBack />
        {item !== undefined ?
        <Card className="card">
            <Card.Header>
            <Card.Title>{item.title}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">{item.subtitle}</Card.Subtitle>
                <Card.Text>{item.text_long}</Card.Text>
            </Card.Body>
        </Card>
        : <h5>Card Not Found</h5> } 
        </div>
    )
}

export default GlossaryItem