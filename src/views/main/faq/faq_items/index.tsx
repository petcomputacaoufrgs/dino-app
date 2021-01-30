import './styles.css'
import React from 'react'
import FaqItemsProps from './props'
import Typography from '@material-ui/core/Typography'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import ListTitle from '../../../../components/list_title'

const FaqItems = ({ data }: FaqItemsProps): JSX.Element => {
	return (
		<div className='faq-items'>
			<ListTitle title={data?.faq.title}/>
			{data && (
				<Accordion className='faq-items__accordion'>
					{data.items.map((item, index) => (
						<Card className='card' key={index}>
							<Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
								<Typography>{item.question}</Typography>
							</Accordion.Toggle>
							<Accordion.Collapse eventKey={index.toString()}>
								<Card.Body>
									<Card.Text>{item.answer}</Card.Text>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					))}
				</Accordion>
			)}
		</div>
	)
}

export default FaqItems
