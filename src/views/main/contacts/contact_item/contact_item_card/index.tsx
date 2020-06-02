import React, { forwardRef } from 'react'
import { Avatar, Typography, IconButton } from '@material-ui/core'
import { Card, CardHeader, CardContent } from '@material-ui/core'
import useStyles from '../../styles'
import ContactModel from '../../../../../services/contact/api_model/ContactModel'
import { List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core'
import { Person as PersonIcon, Phone as PhoneIcon, Edit as EditIcon, Home as HomeIcon, LocalHospital as LocalHospitalIcon } from '@material-ui/icons'
import ContactsConstants from '../../../../../constants/ContactsConstants'
import { useLanguage } from '../../../../../provider/app_provider'
import { wait } from '@testing-library/react'



const ContactItemCard = forwardRef(
  (props: {
    item: ContactModel,
    closeCard: () => void
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
  }, ref): JSX.Element => {

    const classes = useStyles(props)
    const language = useLanguage().current

    const callIcon = () => {
      if (props.item.type === ContactsConstants.MOBILE)
        return <PhoneIcon />
      else if (props.item.type === ContactsConstants.RESIDENTIAL)
        return <HomeIcon />

      return <LocalHospitalIcon />
    }

    const getType = (): string => {
      if (props.item.type === ContactsConstants.MOBILE)
        return language.CONTACTS_MOBILE_PHONE
      else if (props.item.type === ContactsConstants.RESIDENTIAL)
        return language.CONTACTS_RESIDENTIAL_PHONE
      return language.CONTACTS_PUBLIC_SERVICE_PHONE
    }

    const handleEdit = () => {
      props.closeCard()
      setTimeout(() => { props.setEdit(true) }, 300);
    }

    return (
      <Card
        className={classes.card}
        ref={ref}
      >
        <CardHeader
          avatar={
            <Avatar aria-label="avatar" className={classes[props.item.color]}>
              {props.item.name[0]}
            </Avatar>
          }
          action={
            <>
              <IconButton aria-label="edit" size='small' className={classes.iconButton} onClick={handleEdit}>
                <EditIcon />
              </IconButton>

            </>
          }
          title={props.item.name}
          subheader={getType()}
        />
        <CardContent style={{
          paddingTop: 8,
          paddingBottom: 8,
        }}>

          {props.item.description ?
            <ListItem button style={{ paddingTop: 5, paddingLeft: 5, paddingRight: 5, paddingBottom: 5 }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={
                <Typography variant="body2" color="textSecondary" component="p"
                  style={{
                    display: 'flex',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'start',
                  }}>
                  {props.item.description}
                </Typography>
              }
              />
            </ListItem>
            : <></>
          }
          <List component="nav" aria-label="main mailbox folders">


            <Divider style={{ marginTop: 5, marginBottom: 5 }} />
            <ListItem button style={{ paddingTop: 5, paddingLeft: 5, paddingRight: 5 }}>
              <ListItemIcon>
                {callIcon()}
              </ListItemIcon>
              <ListItemText primary={
                <Typography variant="subtitle1" color="textSecondary" component="p">
                  {props.item.phone}
                </Typography>}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card >
    )
  },
)

export default ContactItemCard
