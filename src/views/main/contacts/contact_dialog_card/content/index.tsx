import React, { useEffect, useState } from 'react'
import ContactsConstants from '../../../../../constants/app_data/DataConstants'
import ContactCardContentProps from './props'
import { Typography, CardContent, List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core'
import { Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon, LocalHospitalRounded as HospitalIcon } from '@material-ui/icons'
import PhoneEntity from '../../../../../types/contact/database/PhoneEntity'
import EssentialContactView from '../../../../../types/contact/view/EssentialContactView'
import TreatmentService from '../../../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../../../types/treatment/database/TreatmentEntity'
import DinoLoader from '../../../../../components/loader'
import DinoHr from '../../../../../components/dino_hr'
import language from '../../../../../context/language'

const ContactCardContent = ({ item }: ContactCardContentProps) => {

	const getTypePhoneIcon = (phone: PhoneEntity) => {
		if (phone.type === ContactsConstants.CONTACT_PHONE_CODE_MOBILE) {
			return <PhoneIcon />
		}
		if (phone.type === ContactsConstants.CONTACT_PHONE_CODE_RESIDENTIAL) {
			return <HomeIcon />
		}
		return <HospitalIcon />
	}

	const Description = (): JSX.Element => {
		return item.contact.description ? 
			<ListItem divider className='contacts__list__item'>
				<ListItemIcon>
					<PersonIcon />
				</ListItemIcon>
				<ListItemText
					primary={ <div className='contacts__list__item__text dino__text__wrap'> 
					{item.contact.description} 
					</div>}
				/>
			</ListItem>
		: <></>	
	}

	const Phones = () => {
		return item.phones.length ? (
			<div>
				{item.phones.map((phone, index) => (
					<a
						href={`tel:${phone.number}`}
						style={{ textDecoration: 'none' }}
						key={index}
					>
						<ListItem divider button className='contacts__list__item__content__phones dino__text__wrap'>
							<ListItemIcon>{getTypePhoneIcon(phone)}</ListItemIcon>
							<ListItemText
								primary={
								<Typography variant='subtitle1' color='textSecondary' component='p'>
									{phone.number}
								</Typography>
								}
							/>
						</ListItem>
					</a>
				))}
			</div>
		) : <></>
	}

	return (
		<CardContent className='contacts__list__item__content'>
			<Description />
			<List component='nav'>
				<Phones />
			</List>
			<TreatmentList item={item}/>
		</CardContent>
	)
}

export default ContactCardContent

const TreatmentList = ({item} : ContactCardContentProps) => {

	const treatmentIds = (item as EssentialContactView).contact.treatmentLocalIds

	const [treatments, setTreatments] = useState<TreatmentEntity[]>()

	let [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			if(treatmentIds) {
				const treatments = await TreatmentService.getAllByLocalIds(treatmentIds)
				if(treatments) setTreatments(treatments)
			}
			finishLoading()
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			finishLoading = () => {}
		}
	}, [isLoading])

	return treatments ? 
		<List component='nav'>
			<SectionTitle/>
			<DinoLoader isLoading={isLoading}>
				{treatments.map(e =>
					<ListItem className='contacts__list__item__content__phones dino__text__wrap'>
						<ListItemText primary={e.name}/>
					</ListItem>
				)}
			</DinoLoader>
		</List>
		: <></>
}

const SectionTitle = () => {
	return (
		<div style={{'margin': 0}}>
			<p style={{'margin': 0, 'color': '#a6a6a6', 'textAlign': 'center'}}>{'Treatments'.toUpperCase()}</p>
		</div>
	)
}
