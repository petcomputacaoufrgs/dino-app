import React from 'react'
import ContactsConstants from '../../../../../constants/contact/ContactsConstants'
import ContactCardContentProps from './props'
import useStyles from '../../styles'
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
import PhoneModel from '../../../../../types/contact/PhoneModel'

const ContactCardContent = ({ item }: ContactCardContentProps) => {
  const classes = useStyles()

  const getTypePhoneIcon = (phone: PhoneModel) => {
    if (phone.type === ContactsConstants.MOBILE) {
      return <PhoneIcon />
    }
    if (phone.type === ContactsConstants.RESIDENTIAL) {
      return <HomeIcon />
    }
    return <HospitalIcon />
  }

  const Description = (): JSX.Element => {
    return item.description ? (
      <div className="contact-card-description">
        <ListItem divider className={classes.ListItem}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={classes.TextContact}
              >
                {item.description}
              </Typography>
            }
          />
        </ListItem>
      </div>
    ) : (
      <Divider />
    )
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
            <ListItem button divider className={classes.ListItem}>
              <ListItemIcon>{getTypePhoneIcon(phone)}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    component="p"
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
    <CardContent className={classes.CardContent}>
      <Description />
      <List component="nav">
        <Phones />
      </List>
    </CardContent>
  )
}

export default ContactCardContent
