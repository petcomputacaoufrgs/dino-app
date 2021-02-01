import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import PathConstants from '../../../../constants/app/PathConstants'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../../../context/language'
import GlossaryItemProps from './props'
import './styles.css'
import { IsStaff } from '../../../../context/private_router'
import ItemListMenu from '../../../../components/item_list_menu'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import GlossaryItemEntity from '../../../../types/glossary/database/GlossaryItemEntity'
import AgreementDialog from '../../../../components/agreement_dialog'
import GlossaryItemForm from '../glossary_item_form'
import GlossaryService from '../../../../services/glossary/GlossaryService'

const GlossaryItems = ({ items }: GlossaryItemProps): JSX.Element => {
	const language = useLanguage()
	const staff = IsStaff()

	const [itemToEdit, setItemToEdit] = useState<GlossaryItemEntity | undefined>(undefined,)
	const [itemToDelete, setItemToDelete] = useState<GlossaryItemEntity | undefined>(undefined)

	const handleDelete = () => {
		if(itemToDelete && staff) {
			GlossaryService.delete(itemToDelete)
			setItemToDelete(undefined)
		}
	}

	const GlossaryListItem: React.FC<{item: GlossaryItemEntity}> = ({ item }) => {

		const eventKey = String(item.localId)

		const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			setAnchor(event.currentTarget)
		}

		return (
			<div>
				<Card className='card'>
					<Accordion.Toggle as={Card.Header} eventKey={eventKey}>
						<Card.Title className='card-title'>
							{item.title}
							{staff && <OptionsIconButton dark onClick={handleClick} />}
						</Card.Title>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey={eventKey}>
						<Card.Body>
							<Card.Subtitle className='mb-2'>{item.subtitle}</Card.Subtitle>
							<Card.Text>
								{item.text || language.data.NO_AVAILABLE_TEXT}
							</Card.Text>
							<Link
								className='card-link'
								to={`${staff ? PathConstants.STAFF_GLOSSARY : PathConstants.USER_GLOSSARY}/${item.localId}`}
							>
								{language.data.READ_MORE}
							</Link>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<ItemListMenu
					anchor={anchor}
					setAnchor={setAnchor}
					onEdit={() => setItemToEdit(item)}
					onDelete={() => setItemToDelete(item)}
				/>
			</div>
		)
	}

	return (
		<div className='glossary__items'>
			<Accordion className='accordion'>
				{items.map((item, index) => <GlossaryListItem item={item} key={index}/>)}
			</Accordion>
			<GlossaryItemForm
				open={itemToEdit !== undefined}
				handleClose={() => setItemToEdit(undefined)}
				item={itemToEdit}
			/>
			<AgreementDialog
				open={itemToDelete !== undefined}
				description={language.data.DELETE_CONTACT_OPTION_TEXT}
				question={language.data.DELETE_CONTACT_QUESTION}
				onAgree={handleDelete}
				onDisagree={() => setItemToDelete(undefined)}
			/>
		</div>
	)
}

export default GlossaryItems
