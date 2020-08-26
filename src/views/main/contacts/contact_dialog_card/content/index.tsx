import React, { useState, useEffect } from 'react'
import ContactsConstants from '../../../../../constants/ContactsConstants'
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
  LocalHospital as LocalHospitalIcon,
} from '@material-ui/icons'
import PhoneModel from '../../../../../types/contact/PhoneModel'

const ContactCardContent = ({ item }: ContactCardContentProps) => {
  const classes = useStyles()
  const [phones, setPhones] = useState(new Array<PhoneModel>())

  useEffect(() => setPhones([...item.phones]), [item.phones])

  const getTypePhoneIcon = (phone: PhoneModel) => {
    if (phone.type === ContactsConstants.MOBILE) return <PhoneIcon />
    else if (phone.type === ContactsConstants.RESIDENTIAL) return <HomeIcon />
    return <LocalHospitalIcon />
  }

  const getDescription = () => {
    if (item.description)
      return (
        <ListItem button className={classes.ListItem}>
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
      )
    return <></>
  }

  return (
    <CardContent className={classes.CardContent}>
      {getDescription()}
      <List component="nav">
        <Divider className={classes.DividerMargin} />
        {phones.length ? (
          phones.map((phone, index) => (
            <ListItem button className={classes.ListItem} key={index}>
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
          ))
        ) : (
          <></>
        )}
      </List>
    </CardContent>
  )
}

export default ContactCardContent
