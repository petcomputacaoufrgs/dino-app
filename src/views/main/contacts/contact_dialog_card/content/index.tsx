import React from 'react'
import ContactsConstants from '../../../../../constants/contact/ContactsConstants'
import ContactCardContentProps from './props'
import {
	Typography,
	CardContent,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Divider,
} from '@material-ui/core'
import {
	Person as PersonIcon,
	Phone as PhoneIcon,
	Home as HomeIcon,
	LocalHospitalRounded as HospitalIcon,
} from '@material-ui/icons'
import PhoneEntity from '../../../../../types/contact/database/PhoneEntity'

const ContactCardContent = ({ item }: ContactCardContentProps) => {
	const getTypePhoneIcon = (phone: PhoneEntity) => {
		if (phone.type === ContactsConstants.MOBILE) {
			return <PhoneIcon />
		}
		if (phone.type === ContactsConstants.RESIDENTIAL) {
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
					primary={
						<div className='contacts__list__item__text'>
							{item.contact.description}
						</div>
					}
				/>
			</ListItem>
		: <Divider />	
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
						<ListItem
							button
							divider
							className='contacts__list__item__content__phones'
						>
							<ListItemIcon>{getTypePhoneIcon(phone)}</ListItemIcon>
							<ListItemText
								primary={
									<Typography
										variant='subtitle1'
										color='textSecondary'
										component='p'
									>
										{phone.number}
									</Typography>
								}
							/>
						</ListItem>
					</a>
				))}
			</div>
		) : (
			<></>
		)
	}

	return (
		<CardContent className='contacts__list__item__content'>
			<Description />
			<List component='nav'>
				<Phones />
			</List>
		</CardContent>
	)
}

export default ContactCardContent
