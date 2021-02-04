import './styles.css'
import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import ListTitle from '../../../../components/list_title'
import TreatmentView from '../../../../types/faq/view/FaqView'
import { useParams } from 'react-router-dom'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import FaqItemEntity from '../../../../types/faq/database/FaqItemEntity'
import FaqItemService from '../../../../services/faq/FaqItemService'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import LinkButton from '../../../../components/button/link_button'
import MuiSearchBar from '../../../../components/mui_search_bar'
import QuestionDialogForm from '../question_dialog_form'
import { useLanguage } from '../../../../context/language'
import { IsStaff } from '../../../../context/private_router'

const FaqItems = (): JSX.Element => {

	const { localId } = useParams<{localId: string}>()
	
	const language = useLanguage()
	const staff = IsStaff()

	const [isLoading, setIsLoading] = useState(true)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [data, setData] = useState<TreatmentView>()
	const [searchResults, setSearchResults] = useState<FaqItemEntity[] | undefined>()

	useEffect(() => {
		let loadData = async () => {
			const treatment = await TreatmentService.getByLocalId(Number(localId))
			if(treatment) {
				const faqItems = await FaqItemService.getByTreatment(treatment)
				updateData(treatment, faqItems)
			}

			finishLoading()
		}

		let updateData = (treatment: TreatmentEntity, faqItems: FaqItemEntity[]) => {
			setData({treatment, faqItems})
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		FaqItemService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateData = () => {}
			finishLoading = () => {}
			FaqItemService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, localId])

	useEffect(() => {
		if (data) {
			const results = TreatmentService.getTreatmentViewByFilter(data.treatment, data.faqItems, searchTerm)
			setSearchResults(results?.faqItems)
		}
	}, [data, searchTerm])
	

	const handleSendQuestion = () => {
		setDialogOpen(true)
	}

	const renderFaqItems = () => {
		return (
			<div className='faq-items'>
				<ListTitle title={data?.treatment.name}/>
				{searchResults && (
					<Accordion className='faq-items__accordion'>
						{searchResults.map((item, index) => (
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

	return (
		<>
			<MuiSearchBar
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder={language.data.SEARCH_HOLDER}
			/>
			<div className='faq__content'>
				{renderFaqItems()}
				{data && !staff && (
					<>
						<LinkButton
							text={language.data.NOT_FOUND_QUESTION_FAQ}
							onClick={handleSendQuestion}
						/>
						<QuestionDialogForm
							treatment={data.treatment}
							dialogOpen={dialogOpen}
							setDialogOpen={setDialogOpen}
						/>
					</>
				)}
			</div>
		</>
	)
}

export default FaqItems
