import React, { forwardRef } from 'react'
import { Avatar, Typography, IconButton } from '@material-ui/core'
import { Card, CardHeader, CardContent } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import useStyles from '../../styles'
import ContactModel from '../../../../../services/contact/api_model/ContactModel'
import { List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core'
import { Phone as PhoneIcon } from '@material-ui/icons/';



const ContactItemCard = forwardRef(
  (props: { item: ContactModel }, ref): JSX.Element => {

    const classes = useStyles(props)

    return (
      <Card className={classes.card} ref={ref}>
        <CardHeader
          avatar={
            <Avatar aria-label="avatar" className={classes[props.item.color]}>
              {props.item.name[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={props.item.name}
          subheader={props.item.type}
        />
        <CardContent>
          {props.item.description ?
            <Typography variant="body2" color="textSecondary" component="p" style={{ paddingBottom: 10, paddingLeft: 5, paddingRight: 5 }}>
              {props.item.description}
            </Typography>
            : <></>
          }
          <List component="nav" aria-label="main mailbox folders">
            <Divider />

            <ListItem button style={{ paddingTop: 10, paddingBottom: 0, paddingLeft: 5, paddingRight: 5 }}>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText primary={
                <Typography variant="subtitle1" color="textSecondary" component="p">
                  {props.item.phone}
                </Typography>}
              />
            </ListItem>
          </List>



        </CardContent>
      </Card>
    )
  },
)

export default ContactItemCard
