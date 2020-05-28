import React, { forwardRef } from 'react'
import { Avatar, Typography, IconButton } from '@material-ui/core'
import { Card, CardHeader, CardContent, Slide } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import useStyles from '../../styles'
import ContactModel from '../../../../../services/contact/api_model/ContactModel'

const ContactItemCard = forwardRef(
  (props: { item: ContactModel }, ref): JSX.Element => {

    const classes = useStyles(props)

    const phone = props.item.phone

    return (
      <Card className={classes.card} ref={ref}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes['pink']}>
              {props.item.name[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={props.item.name}
          subheader={`
            ${phone.countryCode ? '+' + phone.countryCode + ' ' : ''}
            ${phone.areaCode ? '(' + phone.areaCode + ') ' : ''}
            ${phone.number}
          `}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.item.description}
          </Typography>
        </CardContent>
      </Card>
    )
  },
)

export default ContactItemCard
